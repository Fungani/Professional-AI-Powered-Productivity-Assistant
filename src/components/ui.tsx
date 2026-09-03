import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'AI is generating...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-200 border-t-transparent animate-pulse-soft" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-xs text-slate-400">This usually takes a few seconds</p>
    </div>
  );
}

interface DisclaimerProps {
  className?: string;
}

export function Disclaimer({ className = '' }: DisclaimerProps) {
  return (
    <p className={`text-xs text-slate-400 italic ${className}`}>
      AI-generated content may require human review.
    </p>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-600/20',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100',
    ghost: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface CopyButtonProps {
  text: string;
}

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600" />
          <span className="text-green-600">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
