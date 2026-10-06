import React from "react";

interface Props {
    issueId: string;
}

export const IssueSummaryHeader: React.FC<Props> = ({ issueId }) => {
    return (
        <div className="d-flex justify-content-between alignments-center mt-3 mb-2">
            <h4 className="mb-0">Issue Summary</h4>
            <span className="badge bg-primary">Issue: {issueId}</span>
        </div>
    );
};
