export interface AiAssistedResolutionMetricsDto {
    fromDate: string;
    toDate: string;
    totalCases: number;
    averageResolutionTimeMinutes: number;
    averageStepsPerCase: number;
}

export interface MetricsFilterBarProps {
    fromDate: string;
    toDate: string;
    onChange: (fromDate: string, toDate: string) => void;
}

export interface AiAssistedMetricsSummaryCardProps {
    totalCases: number;
    averageResolutionTimeMinutes: number;
    averageStepsPerCase: number;
}
