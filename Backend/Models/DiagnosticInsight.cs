namespace Backend.Models
{
    public class DiagnosticInsight
    {
        public string InsightId { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string ProbableCause { get; set; } = string.Empty;
    }
}
