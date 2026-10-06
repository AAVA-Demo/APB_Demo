using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationTemplateRepository
    {
        Task<List<RecommendationTemplate>> GetByIssueStatusAsync(string status);
    }
}
