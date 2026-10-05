export type RemediationStep = {
    id: string;
    order: number;
    title: string;
    description: string;
    isCompleted: boolean;
};

export type UpdateRemediationStepStatusRequest = {
    isCompleted: boolean;
};
