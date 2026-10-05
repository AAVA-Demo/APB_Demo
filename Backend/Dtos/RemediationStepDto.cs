namespace Backend.Dtos
{
    public class RemediationStepDto
    {
        public string StepId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool Completed { get; set; }
    }
}
