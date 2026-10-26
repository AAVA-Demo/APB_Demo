import React, { FormEvent, useState } from "react";
import { useResolutionOutcome } from "../hooks/useResolutionOutcome";
import { RecordResolutionOutcomeRequest } from "../types/diagnosticOutcome";

export interface ResolutionOutcomePanelProps {
    caseId: string;
    insightId: string;
    recordedBy: string;
    onOutcomeRecorded?: () => void;
}

export const ResolutionOutcomePanel: React.FC<ResolutionOutcomePanelProps> = ({
    caseId,
    insightId,
    recordedBy,
    onOutcomeRecorded
}) => {
    const [isResolved, setIsResolved] = useState<boolean | null>(null);
    const [comment, setComment] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const { save, loading, error, result } = useResolutionOutcome(caseId, insightId);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        if (isResolved === null) {
            setValidationError("Resolution outcome is required.");
            return;
        }
        if (comment.length > 500) {
            setValidationError("Comment must not exceed 500 characters.");
            return;
        }
        const request: RecordResolutionOutcomeRequest = {
            isResolved,
            comment,
            recordedBy
        };
        save(request);
    };

    if (result && onOutcomeRecorded) {
        onOutcomeRecorded();
    }

    return (
        <form className="p-3 border rounded mt-3" onSubmit={onSubmit}>
            <h6 className="mb-3">Resolution Outcome</h6>
            <div className="mb-2">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="resolution"
                        id="resolved"
                        checked={isResolved === true}
                        onChange={() => setIsResolved(true)}
                        disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="resolved">
                        Resolved
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="resolution"
                        id="notResolved"
                        checked={isResolved === false}
                        onChange={() => setIsResolved(false)}
                        disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="notResolved">
                        Not Resolved
                    </label>
                </div>
            </div>
            <div className="mb-2">
                <label className="form-label" htmlFor="comment">
                    Comment (optional)
                </label>
                <textarea
                    id="comment"
                    className="form-control"
                    rows={3}
                    maxLength={500}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    disabled={loading}
                />
            </div>
            {validationError && <div className="alert alert-warning mb-2">{validationError}</div>}
            {error && <div className="alert alert-danger mb-2">{error}</div>}
            {result && <div className="alert alert-success mb-2">Outcome saved</div>}
            <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>
        </form>
    );
};
