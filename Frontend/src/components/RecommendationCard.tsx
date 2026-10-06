import React from "react";
import { RecommendationDto } from "../types/recommendation";

interface Props {
    item: RecommendationDto;
}

export const RecommendationCard: React.FC<Props> = ({ item }) => {
    const badgeClass = item.priority === "High" ? "bg-danger" : "bg-secondary";

    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                    <span>{item.title}</span>
                    <span className={`badge ${badgeClass}`}>{item.priority}</span>
                </h5>
                <p className="card-text small">
                    {item.description.length > 120
                        ? item.description.substring(0, 117) + "..."
                        : item.description}
                </p>
                <p className="card-text text-muted small mb-0">Code: {item.code}</p>
            </div>
        </div>
    );
};
