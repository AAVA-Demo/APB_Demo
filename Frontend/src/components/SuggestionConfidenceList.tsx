import React from "react";
import { SuggestionConfidenceViewModel } from "../types/suggestionConfidence";

interface Props {
  suggestions: SuggestionConfidenceViewModel[];
}

export const SuggestionConfidenceList: React.FC<Props> = ({ suggestions }) => {
  return (
    <ul className="list-group">
      {suggestions.map((s) => (
        <li
          key={s.suggestionId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <div className="fw-semibold">{s.description}</div>
            <small className="text-muted">
              Score: {s.confidenceScore.toFixed(2)}
            </small>
          </div>
          <span className={`badge ${s.colorClass}`}>{s.labelText}</span>
        </li>
      ))}
    </ul>
  );
};
