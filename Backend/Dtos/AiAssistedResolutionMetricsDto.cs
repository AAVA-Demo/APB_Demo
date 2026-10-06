using System;

namespace Backend.Dtos
{
    public class AiAssistedResolutionMetricsDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int TotalCases { get; set; }
        public double AverageResolutionTimeMinutes { get; set; }
        public double AverageStepsPerCase { get; set; }
    }
}
