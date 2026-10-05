using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InteractionHistoryRecord
    {
        public string CaseId { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public bool HasCriticalFlag { get; set; }
    }

    public class InteractionHistoryResponse
    {
        public List<InteractionHistoryRecord> Records { get; set; } = new();
    }

    public interface IInteractionHistoryClient
    {
        Task<InteractionHistoryResponse> GetRecentInteractionsAsync(string caseId);
    }
}
