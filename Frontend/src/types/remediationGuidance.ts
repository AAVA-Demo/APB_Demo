export interface RemediationStepDto {
    stepNumber: number;
    title: string;
    instruction: string;
}

export interface RemediationGuidanceDto {
    memberIssueId: string;
    issueSummary: string;
    steps: RemediationStepDto[];
}

export interface RemediationGuidanceSectionProps {
    memberIssueId: string;
}

export interface RemediationStepListProps {
    steps: RemediationStepDto[];
}

export interface RemediationStepItemProps {
    stepNumber: number;
    title: string;
    instruction: string;
}
