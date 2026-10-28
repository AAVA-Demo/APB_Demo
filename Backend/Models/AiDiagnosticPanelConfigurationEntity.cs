namespace Backend.Models
{
    public class AiDiagnosticPanelConfigurationEntity
    {
        public string Id { get; set; } = string.Empty;
        public string DefaultRegionId { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public string PanelTitle { get; set; } = string.Empty;
    }
}
