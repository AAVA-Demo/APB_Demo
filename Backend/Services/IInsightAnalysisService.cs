using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IInsightAnalysisService
    {
        Task<IReadOnlyList<string>> AnalyzeInsightsAsync(Guid memberId);
    }
}
