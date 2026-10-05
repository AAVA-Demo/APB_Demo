import React from "react";
import { useRecommendedActions } from "../hooks/useRecommendedActions";
import { RecommendedActionItem } from "./RecommendedActionItem";

interface Props {
    issueId: string;
}

export const RecommendedActionsList: React.FC<Props> = ({ issueId }) => {
    const { actions, loading, error } = useRecommendedActions(issueId);

    if (loading) {
        return <div className="p-2 text-muted">Loading recommended actions...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2 mb-0">{error}</div>;
    }

    if (!actions.length) {
        return <div className="p-2 text-muted">No recommended actions available.</div>;
    }

    return (
        <ul className="list-unstyled mb-0">
            {actions.map((action) => (
                <li key={action.id} className="mb-2">
                    <RecommendedActionItem action={action} />
                </li>
            ))}
        </ul>
    );
};
