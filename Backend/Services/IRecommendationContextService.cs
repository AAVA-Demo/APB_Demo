using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IRecommendationContextService
    {
        Task<IssueContext?> GetIssueContext(string memberIssueId);
    }
}
