import React from "react";
import { DiagnosticItemDto } from "../types/diagnostic";

interface Props {
    item: DiagnosticItemDto;
}

export const DiagnosticItemCard: React.FC<Props> = ({ item }) => {
    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                    <span>{item.title}</span>
                    <span className="badge bg-secondary">{item.severity}</span>
                </h5>
                <p className="card-text small">{item.description}</p>
                <p className="card-text text-muted small mb-0">
                    Last updated: {new Date(item.lastUpdatedUtc).toLocaleString()}
                </p>
            </div>
        </div>
    );
};
