export interface Recommendation {
    id: string;
    issueId: string;
    text: string;
    confidenceScore: number;
    source?: string;
}
