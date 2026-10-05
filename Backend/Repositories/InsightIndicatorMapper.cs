namespace Backend.Repositories
{
    public class InsightIndicatorMapper : IInsightIndicatorMapper
    {
        public string MapPriority(double confidenceScore)
        {
            if (confidenceScore >= 0.75)
            {
                return "HIGH";
            }

            if (confidenceScore >= 0.5)
            {
                return "MEDIUM";
            }

            return "LOW";
        }
    }
}
