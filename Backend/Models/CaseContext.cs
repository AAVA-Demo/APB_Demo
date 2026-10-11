using System.Collections.Generic;

namespace Backend.Models
{
    public class CaseContext
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RecentInteractions { get; set; } = string.Empty;
        public List<string> Symptoms { get; set; } = new List<string>();
        public List<string> RecentInteractionsList { get; set; } = new List<string>();
    }
}
