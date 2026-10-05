using System;
using System.Linq;
using Backend.Dtos;

namespace Backend.Services
{
    public class IssueContextSummaryMapper : IIssueContextSummaryMapper
    {
        public IssueContextSummaryDto ToSummaryDto(InteractionHistoryResponse history, string memberId, string caseId)
        {
            var mainRecord = history.Records.FirstOrDefault();
            var summaryText = mainRecord?.Summary ?? "No recent interactions.";

            return new IssueContextSummaryDto
            {
                CaseId = caseId,
                MemberId = memberId,
                SummaryText = summaryText,
                LastUpdated = DateTime.UtcNow
            };
        }
    }
}
