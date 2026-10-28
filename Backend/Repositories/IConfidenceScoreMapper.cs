namespace Backend.Repositories
{
    public interface IConfidenceScoreMapper
    {
        string MapToLevel(double score);
    }
}
