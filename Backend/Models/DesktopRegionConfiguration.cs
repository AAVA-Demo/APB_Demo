namespace Backend.Models
{
    public class DesktopRegionConfiguration
    {
        public string RegionId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool SupportsAiPanel { get; set; }
    }
}
