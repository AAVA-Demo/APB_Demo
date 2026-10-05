using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class IssueContextSummaryService : IIssueContextSummaryService
    {
        private readonly IInteractionHistoryClient _historyClient;
        private readonly IIssueContextSummaryMapper _mapper;

        public IssueContextSummaryService(IInteractionHistoryClient historyClient, IIssueContextSummaryMapper mapper)
        {
            _historyClient = historyClient;
            _mapper = mapper;
        }

        public async Task<IssueContextSummaryDto> GetIssueContextSummaryAsync(string caseId, string memberId)
        {
            ValidateCaseId(caseId);
            var history = await _historyClient.GetRecentInteractionsAsync(caseId);
            var dto = _mapper.ToSummaryDto(history, memberId, caseId);
            return dto;
        }

        public Task<IssueContextSummaryDto> BuildIssueContextSummaryAsync(string caseId, string memberId)
        {
            ValidateMemberId(memberId);
            return GetIssueContextSummaryAsync(caseId, memberId);
        }

        private static void ValidateCaseId(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new InvalidOperationException("caseId is required");
            }
        }

        private static void ValidateMemberId(string memberId)
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                throw new InvalidOperationException("memberId is required");
            }
        }
    }
}
