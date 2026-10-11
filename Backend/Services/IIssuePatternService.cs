using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IIssuePatternService
    {
        Task<string?> DetectIssuePatternAsync(string caseId);
    }
}
