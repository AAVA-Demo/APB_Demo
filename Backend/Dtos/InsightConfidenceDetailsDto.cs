namespace Backend.Dtos
{
    public class InsightConfidenceDetailsDto
    {
        public string InsightId { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string ConfidenceLevel { get; set; } = string.Empty;
        public string ConfidenceLabel { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
    }
}
