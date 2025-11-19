import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Primitives ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', loading, className = '', disabled, ...props 
}) => {
  const baseStyles = "h-12 px-8 rounded-pill font-medium transition-all duration-150 ease-out flex items-center justify-center gap-2 text-sm tracking-wide border border-black disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-white hover:text-black",
    secondary: "bg-white text-black hover:bg-black hover:text-white",
    danger: "bg-white text-black border-black hover:bg-red-600 hover:border-red-600 hover:text-white" // Minimal danger hint
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input 
    className={`h-12 px-6 rounded-pill border border-black bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black transition-all w-full ${className}`}
    {...props}
  />
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white border border-black rounded-card p-6 shadow-[0_4px_0_0_rgba(0,0,0,1)] ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold border border-black ${active ? 'bg-black text-white' : 'bg-white text-black'}`}>
    {children}
  </span>
);

// --- Layout Helpers ---

export const Layout: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`min-h-screen bg-white text-black flex flex-col overflow-hidden ${className}`}>
    {children}
  </div>
);