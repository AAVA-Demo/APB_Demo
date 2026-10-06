namespace Backend.Dtos
{
    public class RemediationInstructionDto
    {
        public string InstructionId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
