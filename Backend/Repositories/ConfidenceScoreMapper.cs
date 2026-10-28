namespace Backend.Repositories
{
    public class ConfidenceScoreMapper : IConfidenceScoreMapper
    {
        public string MapToLevel(double score)
        {
            if (score >= 0.8) return "High";
            if (score >= 0.5) return "Medium";
            return "Low";
        }
    }
}
