import React from 'react';
import { ContributingFactorItemProps } from '../types/diagnosticInsights';

export const ContributingFactorItem: React.FC<ContributingFactorItemProps> = ({ factor }) => {
    return <li className="list-group-item d-flex justify-content-between align-items-center">{factor}</li>;
};
