namespace Backend.Models
{
    public class AiDiagnosticPanelConfiguration
    {
        public bool IsEnabled { get; set; }
        public string DefaultRegionId { get; set; } = string.Empty;
        public string PanelTitle { get; set; } = string.Empty;
    }
}
