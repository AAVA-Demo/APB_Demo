import React from "react";
import { RankedRecommendationDto } from "../types/recommendation";

interface Props {
    recommendations: RankedRecommendationDto[];
}

export const RankedRecommendationList: React.FC<Props> = ({ recommendations }) => {
    if (!recommendations.length) {
        return <div className="text-muted">No recommendations available at this time.</div>;
    }

    return (
        <div className="row g-2">
            {recommendations.map((rec, index) => (
                <div key={rec.id} className="col-12 col-md-6">
                    <div className="card p-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className={index === 0 ? "fw-bold" : ""}>
                                #{rec.rank} {rec.description}
                            </span>
                            <span className="badge bg-secondary">
                                {(rec.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
