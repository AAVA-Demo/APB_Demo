using System;

namespace Backend.Dtos
{
    public class InsightRefreshRequestDto
    {
        public Guid IssueId { get; set; }
        public string TriggerSource { get; set; } = string.Empty;
    }
}
