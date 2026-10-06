using System.Collections.Generic;

namespace Backend.Models
{
    public class DiagnosticPanelConfig
    {
        public string Id { get; set; } = string.Empty;
        public string WorkspaceId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public List<DiagnosticPanelSection> Sections { get; set; } = new List<DiagnosticPanelSection>();
    }
}
