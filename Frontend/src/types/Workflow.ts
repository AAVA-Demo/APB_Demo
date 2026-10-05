export interface Workflow {
    id: string;
    issueId: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
}

export interface WorkflowStep {
    id: string;
    order: number;
    title: string;
    instruction: string;
    isCompleted: boolean;
}
