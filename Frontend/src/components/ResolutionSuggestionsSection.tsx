import React from "react";
import { useResolutionSuggestions } from "../hooks/useResolutionSuggestions";
import { ResolutionSuggestionList } from "./ResolutionSuggestionList";

interface Props {
  caseId: string;
}

export const ResolutionSuggestionsSection: React.FC<Props> = ({ caseId }) => {
  const { data, loading, error } = useResolutionSuggestions(caseId);

  return (
    <div className="p-3 border rounded mb-3">
      <h5>Resolution Suggestions</h5>
      {loading && <div className="text-center py-3 spinner-border" />}
      {error && <div className="alert alert-danger p-2 mb-2">{error}</div>}
      {data && <ResolutionSuggestionList resolutions={data.resolutions} />}
      {!loading && !error && data && data.resolutions.length === 0 && (
        <div className="text-muted">No suggestions available.</div>
      )}
    </div>
  );
};
