namespace Backend.Dtos
{
    public class LogGuidedActionExecutionResponseDto
    {
        public string LogId { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string ActionId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
