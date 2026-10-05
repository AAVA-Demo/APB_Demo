using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class DiagnosticInsightDto
    {
        public string Id { get; set; } = string.Empty;
        public string RootCause { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }

    public class DiagnosticInsightResponseDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
        [Required]
        public List<DiagnosticInsightDto> Insights { get; set; } = new();
    }

    public class DiagnosticInsightProcessRequestDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
    }
}
