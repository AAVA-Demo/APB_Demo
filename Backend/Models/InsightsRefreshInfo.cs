using System;

namespace Backend.Models
{
    public class InsightsRefreshInfo
    {
        public string CaseId { get; set; } = string.Empty;
        public DateTime LastRefreshUtc { get; set; }
        public bool RefreshInProgress { get; set; }
    }
}
