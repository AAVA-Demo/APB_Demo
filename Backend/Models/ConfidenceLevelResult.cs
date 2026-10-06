namespace Backend.Models
{
    public class ConfidenceLevelResult
    {
        public double ConfidenceScore { get; set; }
        public string ConfidenceLevel { get; set; } = string.Empty;
        public string ConfidenceLabel { get; set; } = string.Empty;
    }
}
