import { useEffect, useState } from "react";
import { getSuggestionsWithConfidence } from "../api/suggestionConfidenceApi";
import {
  SuggestionConfidenceResponse,
  SuggestionConfidenceViewModel,
} from "../types/suggestionConfidence";

export function useSuggestionConfidence(memberId: string) {
  const [suggestions, setSuggestions] = useState<
    SuggestionConfidenceViewModel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getSuggestionsWithConfidence(memberId)
      .then((response: SuggestionConfidenceResponse) => {
        if (!isMounted) return;
        const mapped = response.suggestions.map((s) => {
          let colorClass = "bg-secondary";
          let labelText = "Low Confidence";
          if (s.confidenceLevel === "HIGH") {
            colorClass = "bg-success";
            labelText = "High Confidence";
          } else if (s.confidenceLevel === "MEDIUM") {
            colorClass = "bg-warning";
            labelText = "Medium Confidence";
          }
          return {
            suggestionId: s.suggestionId,
            description: s.description,
            confidenceScore: s.confidenceScore,
            confidenceLevel: s.confidenceLevel,
            labelText,
            colorClass,
          };
        });
        setSuggestions(mapped);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message ?? "Failed to load suggestions");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [memberId]);

  return { suggestions, loading, error };
}
