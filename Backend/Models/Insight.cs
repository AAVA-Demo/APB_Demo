namespace Backend.Models
{
    public class Insight
    {
        public string CaseId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium";
    }
}
