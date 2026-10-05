using System;
using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class IssueContextMapper : IIssueContextMapper
    {
        public IssueContextSummaryResponseDto? ToSummaryResponse(string caseId)
        {
            return new IssueContextSummaryResponseDto
            {
                CaseId = caseId,
                MemberId = "member-1",
                SummaryText = "Issue context summary for the case.",
                RecentEvents = new List<IssueEventDto>
                {
                    new IssueEventDto
                    {
                        Timestamp = DateTimeOffset.UtcNow.AddDays(-1),
                        Description = "Member called support."
                    }
                },
                KeyIndicators = new List<KeyIndicatorDto>
                {
                    new KeyIndicatorDto
                    {
                        Name = "RiskScore",
                        Value = "Medium"
                    }
                }
            };
        }
    }
}
