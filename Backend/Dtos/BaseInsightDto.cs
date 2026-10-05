namespace Backend.Dtos
{
    public class BaseInsightDto
    {
        public string Id { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
    }
}
