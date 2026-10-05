import React, { useState } from "react";
import { useRecommendationFeedback } from "../hooks/useRecommendationFeedback";

interface Props {
    recommendationId: string;
    caseId: string;
    memberId: string;
    title: string;
    description: string;
    token?: string;
}

export const RecommendationItem: React.FC<Props> = ({ recommendationId, caseId, memberId, title, description, token }) => {
    const { data, loading, error, submit } = useRecommendationFeedback(recommendationId, token);
    const [comment, setComment] = useState<string>("");

    const feedbackType = data?.feedbackType;

    const handleClick = async (type: "HELPFUL" | "NOT_HELPFUL") => {
        await submit({ caseId, memberId, feedbackType: type, comment: comment || undefined });
    };

    return (
        <div className="border rounded p-2 d-flex flex-column gap-1">
            <div className="fw-semibold">{title}</div>
            <div className="small">{description}</div>
            <div className="d-flex align-items-center gap-2 mt-1">
                <button
                    type="button"
                    className={`btn btn-sm ${feedbackType === "HELPFUL" ? "btn-success" : "btn-outline-success"}`}
                    disabled={loading || feedbackType === "HELPFUL"}
                    onClick={() => handleClick("HELPFUL")}
                >
                    Helpful
                </button>
                <button
                    type="button"
                    className={`btn btn-sm ${feedbackType === "NOT_HELPFUL" ? "btn-danger" : "btn-outline-danger"}`}
                    disabled={loading || feedbackType === "NOT_HELPFUL"}
                    onClick={() => handleClick("NOT_HELPFUL")}
                >
                    Not Helpful
                </button>
                {loading && <span className="text-muted small">Submitting...</span>}
                {data && <span className="text-success small">Feedback status: {data.status}</span>}
            </div>
            <textarea
                className="form-control form-control-sm mt-1"
                rows={2}
                placeholder="Add optional comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
            />
            {error && <div className="alert alert-secondary py-1 my-0 mt-1">{error}</div>}
        </div>
    );
};
