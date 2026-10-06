import React from 'react';
import { DiagnosticPanelSectionsProps } from '../types/diagnosticPanelContext';

export const DiagnosticPanelSections: React.FC<DiagnosticPanelSectionsProps> = ({ sections }) => {
    if (!sections || !sections.length) {
        return <div className="text-muted">No sections configured.</div>;
    }

    return (
        <div className="d-flex flex-column gap-2">
            {sections.map(section => (
                <div key={section.key} className="border rounded p-2">
                    <strong>{section.displayName}</strong>
                </div>
            ))}
        </div>
    );
};
