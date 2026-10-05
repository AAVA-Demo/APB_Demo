using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRootCauseEngine
    {
        Task<IReadOnlyList<RootCauseRecommendation>> GenerateRootCauseRecommendationsAsync(string caseId);
    }
}
