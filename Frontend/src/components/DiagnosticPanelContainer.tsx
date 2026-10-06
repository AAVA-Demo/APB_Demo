import React from 'react';
import { DiagnosticPanelContainerProps, PanelSectionViewModel } from '../types/diagnosticPanelContext';
import { useDiagnosticPanelContext } from '../hooks/useDiagnosticPanelContext';
import { DiagnosticPanelHeader } from './DiagnosticPanelHeader';
import { DiagnosticPanelSections } from './DiagnosticPanelSections';

export const DiagnosticPanelContainer: React.FC<DiagnosticPanelContainerProps> = ({ memberIssueId }) => {
    const { context, loading, error } = useDiagnosticPanelContext(memberIssueId);

    if (loading) {
        return <div className="p-3 border rounded bg-light">Loading diagnostic panel...</div>;
    }

    if (error) {
        return <div className="p-3 border rounded bg-light text-danger">Unable to load diagnostic panel. Please refresh or contact support.</div>;
    }

    if (!context || !context.isPanelAvailable) {
        return <div className="p-3 border rounded bg-light">Diagnostic insights are not available for this issue.</div>;
    }

    const sections: PanelSectionViewModel[] = context.panelSections.map(s => ({ key: s.sectionKey, displayName: s.displayName }));

    return (
        <div className="p-3 border rounded bg-white">
            <DiagnosticPanelHeader panelTitle={context.panelTitle} />
            <DiagnosticPanelSections sections={sections} />
        </div>
    );
};
