import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize mostly for type safety, actual calls check key
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateQuestion = async (stage: 1 | 2, context: string, mode: string): Promise<string> => {
  if (!ai) return "Describe a challenging technical problem you solved recently.";

  const model = "gemini-2.5-flash";
  
  let prompt = "";
  if (stage === 1) {
    prompt = `You are an IT Recruiter with a ${mode} tone. Ask a single, short, behavioral interview question about: ${context}. Do not include greetings.`;
  } else {
    prompt = `You are a Technical Lead with a ${mode} tone. Provide a short coding challenge description for: ${context}. Plain text only, no markdown code blocks.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Tell me about yourself.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return stage === 1 ? "Tell me about a time you failed." : "Write a function to reverse a string.";
  }
};

export const evaluateResponse = async (question: string, answer: string, code?: string): Promise<{ score: number; feedback: string }> => {
  if (!ai) return { score: 85, feedback: "System in offline mode. Response recorded." };

  const model = "gemini-2.5-flash";
  const content = code 
    ? `Question: ${question}. Code Solution: ${code}. Verbal Explanation: ${answer}. Rate the solution 0-100 and provide a 1 sentence summary.`
    : `Question: ${question}. Answer: ${answer}. Rate the quality 0-100 and provide a 1 sentence summary.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: content,
    });
    
    const text = response.text || "";
    const match = text.match(/(\d+)/);
    const score = match ? parseInt(match[0]) : 75;
    
    return { score, feedback: text };
  } catch (error) {
    return { score: 70, feedback: "Evaluation pending manual review." };
  }
};