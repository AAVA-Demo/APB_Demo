using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InteractionHistoryClient : IInteractionHistoryClient
    {
        public Task<InteractionHistoryResponse> GetRecentInteractionsAsync(string caseId)
        {
            var response = new InteractionHistoryResponse
            {
                Records = new List<InteractionHistoryRecord>
                {
                    new InteractionHistoryRecord
                    {
                        CaseId = caseId,
                        Summary = "Recent contact about billing issue.",
                        HasCriticalFlag = false
                    }
                }
            };

            return Task.FromResult(response);
        }
    }
}
