namespace Backend.Dtos
{
    public class GuidedResolutionStepStatusUpdateDto
    {
        public string StepId { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
    }
}
