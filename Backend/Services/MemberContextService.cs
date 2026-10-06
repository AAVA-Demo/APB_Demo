using System;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class MemberContextService : IMemberContextService
    {
        public Task<MemberInteractionContext> GetCurrentInteractionContext(string caseId)
        {
            var context = new MemberInteractionContext
            {
                MemberId = "member-" + caseId,
                CaseId = caseId,
                CurrentDataJson = "{}",
                InteractionDataJson = "{}"
            };
            return Task.FromResult(context);
        }

        public Task<MemberContext> GetMemberContext(string caseId)
        {
            var context = new MemberContext
            {
                MemberId = "member-" + caseId,
                CaseId = caseId,
                HistoricalDataJson = "{}",
                CurrentDataJson = "{}"
            };
            return Task.FromResult(context);
        }

        public Task<MemberContext> GetCurrentMemberContext(string caseId)
        {
            return GetMemberContext(caseId);
        }

        public Task<MemberContextSummary> GetMemberContextSummary(string caseId)
        {
            var summary = new MemberContextSummary
            {
                CaseId = caseId,
                MemberId = "member-" + caseId,
                SummaryText = "Sample context summary for case " + caseId
            };
            return Task.FromResult(summary);
        }
    }
}
