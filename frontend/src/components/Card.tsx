import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface rounded-lg shadow-md p-md ${className}`}>
      {children}
    </div>
  );
}
