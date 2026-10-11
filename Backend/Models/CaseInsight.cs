namespace Backend.Models
{
    public class CaseInsight
    {
        public string Id { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string Type { get; set; } = string.Empty;
    }
}
