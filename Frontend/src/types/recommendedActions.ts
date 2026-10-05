export interface RecommendedAction {
    id: string;
    issueId: string;
    title: string;
    description?: string;
    priorityRank: number;
    impactScore: number;
    isHighImpact: boolean;
}
