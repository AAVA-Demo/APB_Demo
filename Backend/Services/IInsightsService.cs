using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightsService
    {
        Task<IReadOnlyList<MemberInsightDto>> GetInsightsAsync(Guid memberId);
        Task<IReadOnlyList<MemberInsightDto>> RefreshInsightsAsync(Guid memberId, RefreshInsightsRequest? request);
    }
}
