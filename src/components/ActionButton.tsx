"use client";

import type { ReactNode } from "react";

type Variant = "primary" | "danger";

export function ActionButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
}) {
  const background =
    variant === "danger" ? "rgb(194, 51, 77)" : "rgb(37, 99, 235)";

  return (
    <button
      onClick={onClick}
      style={{
        background,
        color: "white",
        borderRadius: "8px",
        padding: "8px 14px",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}
