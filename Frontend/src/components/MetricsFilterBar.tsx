import React from 'react';
import { MetricsFilterBarProps } from '../types/aiAssistedMetrics';

export const MetricsFilterBar: React.FC<MetricsFilterBarProps> = ({ fromDate, toDate, onChange }) => {
    return (
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-end">
            <div className="flex-fill">
                <label className="form-label">From date</label>
                <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={e => onChange(e.target.value, toDate)}
                />
            </div>
            <div className="flex-fill">
                <label className="form-label">To date</label>
                <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={e => onChange(fromDate, e.target.value)}
                />
            </div>
        </div>
    );
};
