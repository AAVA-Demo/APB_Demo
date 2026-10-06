namespace Backend.Models
{
    public class RemediationStepDefinition
    {
        public string DefinitionStepId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsRequired { get; set; }
    }
}
