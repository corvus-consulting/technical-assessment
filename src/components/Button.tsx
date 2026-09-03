"use client";

import type { ReactNode } from "react";

export function Button({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: "#2563eb",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "8px 14px",
        fontSize: "14px",
        fontWeight: 500,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
