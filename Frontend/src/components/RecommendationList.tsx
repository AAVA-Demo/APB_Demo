import React from "react";
import { RecommendationDto } from "../types/recommendation";
import { RecommendationCard } from "./RecommendationCard";

interface Props {
    items: RecommendationDto[];
}

export const RecommendationList: React.FC<Props> = ({ items }) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 g-2">
            {items.map((item) => (
                <div className="col" key={item.code}>
                    <RecommendationCard item={item} />
                </div>
            ))}
        </div>
    );
};
