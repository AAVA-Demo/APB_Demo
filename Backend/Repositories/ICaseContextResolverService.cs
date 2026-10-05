using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseContextResolverService
    {
        CaseContext? ResolveCaseContext(string caseId, string? memberId);
    }
}
