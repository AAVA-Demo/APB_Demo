namespace Backend.Dtos
{
    public class SuggestionConfidenceDto
    {
        public string SuggestionId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string ConfidenceLevel { get; set; } = string.Empty;
    }
}
