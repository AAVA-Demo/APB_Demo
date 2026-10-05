namespace Backend.Models
{
    public class DiagnosticInsight
    {
        public string InsightId { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string RootCause { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}
