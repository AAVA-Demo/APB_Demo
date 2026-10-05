using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class IssueContextSummaryDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public string MemberId { get; set; } = string.Empty;
        public string SummaryText { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }

    public class IssueContextSummaryBuildRequestDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public string MemberId { get; set; } = string.Empty;
    }
}
