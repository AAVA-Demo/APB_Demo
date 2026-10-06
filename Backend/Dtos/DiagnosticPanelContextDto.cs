using System.Collections.Generic;

namespace Backend.Dtos
{
    public class DiagnosticPanelContextDto
    {
        public string MemberIssueId { get; set; } = string.Empty;
        public bool IsPanelAvailable { get; set; }
        public string PanelTitle { get; set; } = string.Empty;
        public List<PanelSectionDto> PanelSections { get; set; } = new List<PanelSectionDto>();
    }
}
