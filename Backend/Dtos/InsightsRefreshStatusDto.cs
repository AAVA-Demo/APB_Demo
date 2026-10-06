using System;

namespace Backend.Dtos
{
    public class InsightsRefreshStatusDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string RefreshStatus { get; set; } = string.Empty;
        public DateTime RefreshedAtUtc { get; set; }
        public bool RefreshInProgress { get; set; }
    }
}
