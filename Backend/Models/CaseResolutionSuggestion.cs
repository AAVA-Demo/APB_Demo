namespace Backend.Models
{
    public class CaseResolutionSuggestion
    {
        public string Id { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int EstimatedTimeMinutes { get; set; }
        public double SuccessProbability { get; set; }
        public int Rank { get; set; }
    }
}
