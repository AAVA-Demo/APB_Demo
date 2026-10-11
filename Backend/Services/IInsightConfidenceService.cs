namespace Backend.Services
{
    public interface IInsightConfidenceService
    {
        string MapScoreToLevel(double score);
    }
}
