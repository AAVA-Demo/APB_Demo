using Backend.Models;

namespace Backend.Repositories
{
    public class CaseContextResolverService : ICaseContextResolverService
    {
        public CaseContext? ResolveCaseContext(string caseId, string? memberId)
        {
            return new CaseContext
            {
                CaseId = caseId,
                MemberId = memberId ?? "member-1",
                SourceSystem = "CaseManagement"
            };
        }
    }
}
