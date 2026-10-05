export type GuidedWorkflowStatus = "InProgress" | "Completed" | "Escalated";
export type GuidedStepStatus = "Pending" | "Completed" | "Escalated";

export interface GuidedResolutionStep {
    id: string;
    order: number;
    title: string;
    description?: string;
    status: GuidedStepStatus;
}

export interface GuidedResolutionWorkflow {
    issueId: string;
    status: GuidedWorkflowStatus;
    steps: GuidedResolutionStep[];
}
