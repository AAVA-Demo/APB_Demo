import React from "react";
import { GuidedActionDto } from "../types/guidedActions";
import { GuidedActionItem } from "./GuidedActionItem";

export interface GuidedActionsListProps {
  actions: GuidedActionDto[];
  onActionExecuted: (action: GuidedActionDto) => void;
}

export const GuidedActionsList: React.FC<GuidedActionsListProps> = ({ actions, onActionExecuted }) => {
  if (!actions.length) {
    return <div className="text-muted">No guided actions available.</div>;
  }

  return (
    <div className="list-group">
      {actions.map(action => (
        <GuidedActionItem key={action.actionId} action={action} onExecute={() => onActionExecuted(action)} />
      ))}
    </div>
  );
};
