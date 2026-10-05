using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IAIInsightEngine
    {
        List<BaseInsightDto> GetInsights(string caseId);
    }
}
