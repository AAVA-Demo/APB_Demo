import React from "react";
import { DiagnosticItemDto } from "../types/diagnostic";
import { DiagnosticItemCard } from "./DiagnosticItemCard";

interface Props {
    items: DiagnosticItemDto[];
}

export const DiagnosticItemList: React.FC<Props> = ({ items }) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 g-2">
            {items.map((item) => (
                <div className="col" key={item.code}>
                    <DiagnosticItemCard item={item} />
                </div>
            ))}
        </div>
    );
};
