using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class DiagnosticPanelContextDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public string MemberId { get; set; } = string.Empty;
        public bool PanelEnabled { get; set; }
        public string InsightsSummary { get; set; } = string.Empty;
    }
}
