export interface RemediationStep {
    id: string;
    issueId: string;
    stepOrder: number;
    title: string;
    description: string;
    category?: string;
}
