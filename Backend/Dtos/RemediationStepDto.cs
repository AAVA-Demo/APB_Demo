namespace Backend.Dtos
{
    public class RemediationStepDto
    {
        public string StepId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
