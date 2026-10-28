namespace Backend.Models
{
    public class InteractionContext
    {
        public string InteractionId { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
    }
}
