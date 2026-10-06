export interface DiagnosticInsightsDto {
    memberIssueId: string;
    generatedAt: string;
    rootCauseSummary: string;
    contributingFactors: string[];
}

export interface DiagnosticInsightsSectionProps {
    memberIssueId: string;
}

export interface ContributingFactorListProps {
    contributingFactors: string[];
}

export interface ContributingFactorItemProps {
    factor: string;
}
