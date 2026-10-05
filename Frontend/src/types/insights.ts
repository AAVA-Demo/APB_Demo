export interface InsightIndicator {
    id: string;
    description: string;
    confidenceScore: number;
    priority: "HIGH" | "MEDIUM" | "LOW";
}
