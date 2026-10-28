namespace Backend.Models
{
    public class DesktopRegionConfigurationEntity
    {
        public string Id { get; set; } = string.Empty;
        public string LayoutConfigurationId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool SupportsAiPanel { get; set; }
    }
}
