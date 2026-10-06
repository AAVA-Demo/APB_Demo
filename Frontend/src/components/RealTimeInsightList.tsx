import React from "react";
import { RealTimeInsightItemDto } from "../types/realtimeInsight";
import { RealTimeInsightCard } from "./RealTimeInsightCard";

interface Props {
    items: RealTimeInsightItemDto[];
}

export const RealTimeInsightList: React.FC<Props> = ({ items }) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 g-2">
            {items.map((item) => (
                <div className="col" key={item.code}>
                    <RealTimeInsightCard item={item} />
                </div>
            ))}
        </div>
    );
};
