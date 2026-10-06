using System;

namespace Backend.Models
{
    public class CaseData
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PayloadJson { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
    }
}
