import React from 'react';
import { HistoryItem } from '../types/MemberContext';

interface HistorySummaryProps {
    items: HistoryItem[];
}

export const HistorySummary: React.FC<HistorySummaryProps> = ({ items }) => {
    return (
        <div>
            <h5 className="mb-2">Relevant History</h5>
            {items.length === 0 && <div className="text-muted">No relevant history.</div>}
            <ul className="list-unstyled">
                {items.map((item) => (
                    <li key={item.id} className="mb-2">
                        <div className="fw-bold">{item.category}</div>
                        <div>{item.description}</div>
                        <small className="text-secondary">
                            {new Date(item.occurredAt).toLocaleDateString()}
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
};
