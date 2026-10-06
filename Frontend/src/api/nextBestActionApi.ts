import { apiClient } from './apiClient';
import { NextBestActionPromptDto } from '../types/nextBestAction';

export async function getNextBestActionPrompt(memberIssueId: string): Promise<NextBestActionPromptDto> {
    const url = `/api/diagnostic-panel/next-best-action?memberIssueId=${encodeURIComponent(memberIssueId)}`;
    return apiClient(url);
}
