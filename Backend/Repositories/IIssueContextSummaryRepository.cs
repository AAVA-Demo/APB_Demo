using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IIssueContextSummaryRepository
    {
        Task<IssueContextSummary?> GetByCaseIdAsync(string caseId);
        Task SaveAsync(IssueContextSummary summary);
    }
}
