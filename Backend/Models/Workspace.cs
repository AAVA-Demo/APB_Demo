namespace Backend.Models
{
    public class Workspace
    {
        public string WorkspaceId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool PanelEnabled { get; set; }
    }
}
