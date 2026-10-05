using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IMemberContextRepository
    {
        Task<MemberIssueEntity?> GetIssueAsync(Guid memberId, Guid caseId);
        Task<IList<MemberInteractionEntity>> GetRecentInteractionsAsync(Guid memberId, Guid caseId);
        Task<IList<MemberHistoryEntity>> GetRelevantHistoryAsync(Guid memberId);
    }
}
