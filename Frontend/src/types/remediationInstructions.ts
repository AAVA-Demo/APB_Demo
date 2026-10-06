export interface RemediationInstructionDto {
    instructionId: string;
    order: number;
    title: string;
    description: string;
}

export interface RemediationInstructionsResponseDto {
    issueId: string;
    instructions: RemediationInstructionDto[];
}

export interface RemediationInstructionsRefreshStatusDto {
    issueId: string;
    refreshedAtUtc: string;
    instructionCount: number;
}

export interface RemediationInstructionViewModel {
    instructionId: string;
    order: number;
    title: string;
    description: string;
}
