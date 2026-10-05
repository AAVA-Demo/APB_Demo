import React from "react";
import { RecommendationDto } from "../types/insightStream";

interface Props {
    recommendations: RecommendationDto[];
}

export const RecommendationList: React.FC<Props> = ({ recommendations }) => {
    if (!recommendations.length) {
        return <div className="text-muted">No recommendations available.</div>;
    }

    return (
        <ul className="list-group">
            {recommendations.map((rec) => (
                <li key={rec.id} className="list-group-item">
                    {rec.text}
                </li>
            ))}
        </ul>
    );
};
