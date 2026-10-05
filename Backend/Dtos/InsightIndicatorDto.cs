namespace Backend.Dtos
{
    public class InsightIndicatorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string Priority { get; set; } = string.Empty;
    }
}
