import React from "react";
import { InsightConfidenceDetailsViewModel } from "../types/insightConfidence";

interface Props {
    isOpen: boolean;
    insightId: string | null;
    onClose: () => void;
    details: InsightConfidenceDetailsViewModel | null;
    isLoading: boolean;
    error: string | null;
}

export const InsightConfidenceDetailsModal: React.FC<Props> = ({ isOpen, onClose, details, isLoading, error }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confidence Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {isLoading && <div className="text-muted">Loading details...</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {!isLoading && !error && details && (
                            <div>
                                <p><strong>Score:</strong> {(details.confidenceScore * 100).toFixed(0)}%</p>
                                <p><strong>Level:</strong> {details.confidenceLevel}</p>
                                <p><strong>Label:</strong> {details.confidenceLabel}</p>
                                <p>{details.explanation}</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
