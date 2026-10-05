namespace Backend.Dtos
{
    public class DiagnosticInsightsResponse
    {
        public string MemberId { get; set; } = string.Empty;
        public List<DiagnosticInsightDto> Insights { get; set; } = new();
        public DateTime LastUpdated { get; set; }
    }
}
