import React from 'react';
import { DiagnosticPanelHeaderProps } from '../types/diagnosticPanelContext';

export const DiagnosticPanelHeader: React.FC<DiagnosticPanelHeaderProps> = ({ panelTitle }) => {
    return <h4 className="mb-3">{panelTitle}</h4>;
};
