namespace Backend.Models
{
    public class RemediationStep
    {
        public string StepId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public int StepNumber { get; set; }
        public string Instruction { get; set; } = string.Empty;
    }
}
