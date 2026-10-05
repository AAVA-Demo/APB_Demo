import React from 'react';
import { Interaction } from '../types/MemberContext';

interface ActivityTimelineProps {
    interactions: Interaction[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ interactions }) => {
    return (
        <div>
            <h5 className="mb-2">Recent Activity</h5>
            {interactions.length === 0 && <div className="text-muted">No recent interactions.</div>}
            <ul className="list-unstyled">
                {interactions.map((item) => (
                    <li key={item.id} className="mb-2">
                        <div className="fw-bold">{item.channel}</div>
                        <div>{item.summary}</div>
                        <small className="text-secondary">
                            {new Date(item.occurredAt).toLocaleString()}
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
};
