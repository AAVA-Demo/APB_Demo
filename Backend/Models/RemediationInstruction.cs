namespace Backend.Models
{
    public class RemediationInstruction
    {
        public string InstructionId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
