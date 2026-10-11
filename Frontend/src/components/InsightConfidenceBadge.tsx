import React from "react";

interface Props {
  confidenceLevel: string;
  confidenceScore: number;
}

export const InsightConfidenceBadge: React.FC<Props> = ({ confidenceLevel, confidenceScore }) => {
  const level = confidenceLevel.toLowerCase();
  const color = level === "high" ? "success" : level === "medium" ? "warning" : "secondary";
  const title = `Confidence: ${confidenceLevel} (${Math.round(confidenceScore * 100)}%)`;

  return (
    <span className={`badge bg-${color}`} title={title}>
      {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)}
    </span>
  );
};
