import React from "react";
import { ResolutionSuggestionDto } from "../types/resolutions";
import { ResolutionSuggestionItem } from "./ResolutionSuggestionItem";

interface Props {
  resolutions: ResolutionSuggestionDto[];
}

export const ResolutionSuggestionList: React.FC<Props> = ({ resolutions }) => {
  return (
    <div>
      {resolutions.map((r) => (
        <ResolutionSuggestionItem key={r.id} suggestion={r} />
      ))}
      {resolutions.length === 0 && <div className="text-muted">No suggestions.</div>}
    </div>
  );
};
