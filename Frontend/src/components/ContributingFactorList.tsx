import React from 'react';
import { ContributingFactorListProps } from '../types/diagnosticInsights';
import { ContributingFactorItem } from './ContributingFactorItem';

export const ContributingFactorList: React.FC<ContributingFactorListProps> = ({ contributingFactors }) => {
    if (!contributingFactors || contributingFactors.length === 0) {
        return <div className="text-muted">No contributing factors listed.</div>;
    }

    return (
        <ul className="list-group mb-2">
            {contributingFactors.map((factor, index) => (
                <ContributingFactorItem key={index} factor={factor} />
            ))}
        </ul>
    );
};
