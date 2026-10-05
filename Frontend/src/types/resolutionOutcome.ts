export interface ResolutionOutcome {
  id: string;
  issueId: string;
  outcome: 'Resolved' | 'NotResolved';
  comments?: string;
  agentId: string;
  recordedAt: string;
}

export interface CreateResolutionOutcomeRequest {
  outcome: 'Resolved' | 'NotResolved';
  comments?: string;
}
