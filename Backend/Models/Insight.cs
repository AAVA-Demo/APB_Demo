namespace Backend.Models
{
    public class Insight
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string Type { get; set; } = string.Empty;
    }
}
