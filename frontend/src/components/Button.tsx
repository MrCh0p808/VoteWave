import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "destructive";
};

export default function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  const base = "px-md py-sm rounded-md font-medium";
  const variants: Record<string, string> = {
    primary: "bg-primary text-surface hover:opacity-90",
    secondary: "bg-secondary text-textPrimary hover:opacity-90",
    destructive: "bg-error text-surface hover:opacity-90",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}