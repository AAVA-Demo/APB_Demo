using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IRealTimeInsightsEngineClient
    {
        Task<List<RealTimeInsight>> GenerateRealTimeInsights(MemberInteractionContext context);
    }
}
