namespace Backend.Models
{
    public class DiagnosticPanelSection
    {
        public string Id { get; set; } = string.Empty;
        public string PanelConfigId { get; set; } = string.Empty;
        public string SectionKey { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
    }
}
