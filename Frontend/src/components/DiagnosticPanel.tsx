import React from "react";
import { DiagnosticInsightDto } from "../types/diagnostic";
import { DiagnosticItemList } from "./DiagnosticItemList";

interface Props {
    data: DiagnosticInsightDto | null;
    loading: boolean;
    error: string | null;
}

export const DiagnosticPanel: React.FC<Props> = ({ data, loading, error }) => {
    return (
        <div className="card mb-3">
            <div className="card-header">AI Diagnostic Insights</div>
            <div className="card-body">
                {loading && <div className="text-center"><div className="spinner-border" /></div>}
                {error && <div className="alert alert-danger mb-2">{error}</div>}
                {!loading && !error && data && data.insights.length > 0 && (
                    <DiagnosticItemList items={data.insights} />
                )}
                {!loading && !error && (!data || data.insights.length === 0) && (
                    <p className="text-muted">No diagnostic insights available.</p>
                )}
            </div>
        </div>
    );
};
