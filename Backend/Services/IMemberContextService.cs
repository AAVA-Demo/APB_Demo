using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IMemberContextService
    {
        Task<MemberContextDto?> GetMemberContextAsync(System.Guid memberId, System.Guid caseId);
    }
}
