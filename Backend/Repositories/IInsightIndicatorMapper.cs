namespace Backend.Repositories
{
    public interface IInsightIndicatorMapper
    {
        string MapPriority(double confidenceScore);
    }
}
