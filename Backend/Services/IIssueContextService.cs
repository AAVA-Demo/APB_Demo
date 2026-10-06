using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IIssueContextService
    {
        Task<IssueContext?> GetIssueContext(string memberIssueId);
    }
}
