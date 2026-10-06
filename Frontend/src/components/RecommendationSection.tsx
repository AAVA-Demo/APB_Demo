import React from "react";
import { RecommendationSetDto } from "../types/recommendation";
import { RecommendationList } from "./RecommendationList";

interface Props {
    data: RecommendationSetDto | null;
    loading: boolean;
    error: string | null;
}

export const RecommendationSection: React.FC<Props> = ({ data, loading, error }) => {
    return (
        <div className="card mb-3">
            <div className="card-header">Context-Aware Recommendations</div>
            <div className="card-body">
                {loading && <div className="text-center"><div className="spinner-border" /></div>}
                {error && <div className="alert alert-danger mb-2">{error}</div>}
                {!loading && !error && data && data.recommendations.length > 0 && (
                    <RecommendationList items={data.recommendations} />
                )}
                {!loading && !error && (!data || data.recommendations.length === 0) && (
                    <p className="text-muted">No recommendations available.</p>
                )}
            </div>
        </div>
    );
};
