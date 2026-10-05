import { apiClient } from './apiClient';
import { MemberContext } from '../types/MemberContext';

export async function getMemberContext(memberId: string, caseId: string): Promise<MemberContext> {
    return apiClient.get<MemberContext>(`/api/members/${memberId}/cases/${caseId}/context`);
}
