namespace Backend.Models
{
    public class AgentRemediationStep
    {
        public string StepId { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public int StepNumber { get; set; }
        public string Instruction { get; set; } = string.Empty;
    }
}
