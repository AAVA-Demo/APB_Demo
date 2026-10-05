using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IMemberIssueSummaryService
    {
        Task<MemberIssueSummaryDto?> GetMemberIssueSummaryAsync(Guid memberId);
    }
}
