import React, { useState } from "react";
import { GuidedActionDto } from "../types/guidedActions";

export interface GuidedActionItemProps {
  action: GuidedActionDto;
  onExecute: () => void;
}

export const GuidedActionItem: React.FC<GuidedActionItemProps> = ({ action, onExecute }) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading || completed) return;
    setLoading(true);
    setError(null);
    try {
      await onExecute();
      setCompleted(true);
    } catch (e: any) {
      setError(e.message || "Failed to log action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <div>{action.actionName}</div>
        {action.additionalContext && <div className="small text-muted">{action.additionalContext}</div>}
        {error && <div className="small text-danger">{error}</div>}
      </div>
      <button className="btn btn-sm btn-outline-primary" disabled={loading || completed} onClick={handleClick}>
        {loading ? "Logging..." : completed ? "Completed" : "Mark as Completed"}
      </button>
    </div>
  );
};
