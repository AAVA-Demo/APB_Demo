import React from "react";
import { useSuggestionConfidence } from "../hooks/useSuggestionConfidence";
import { SuggestionConfidenceList } from "./SuggestionConfidenceList";

interface Props {
  memberId: string;
}

export const SuggestionConfidencePanel: React.FC<Props> = ({ memberId }) => {
  const { suggestions, loading, error } = useSuggestionConfidence(memberId);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Suggestions with Confidence</h5>
        {loading && <div className="spinner-border" role="status" />}
        {error && (
          <div className="alert alert-warning mt-2" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && suggestions.length === 0 && (
          <p className="text-muted mb-0">No suggestions available.</p>
        )}
        {!loading && !error && suggestions.length > 0 && (
          <SuggestionConfidenceList suggestions={suggestions} />
        )}
      </div>
    </div>
  );
};
