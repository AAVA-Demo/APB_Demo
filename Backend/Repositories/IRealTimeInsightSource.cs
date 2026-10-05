using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IRealTimeInsightSource
    {
        List<RealTimeInsightDto> GetLatestInsights(string caseId);
    }
}
