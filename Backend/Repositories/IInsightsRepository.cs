using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IInsightsRepository
    {
        Task<List<MemberInsight>> GetInsightsForMemberAsync(Guid memberId);
        Task SaveInsightsAsync(Guid memberId, List<MemberInsight> insights);
    }
}
