using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Repositories;

namespace Backend.Services
{
    // Default implementation that derives simple root causes from diagnostic insights.
    public class InsightAnalysisService : IInsightAnalysisService
    {
        private readonly IDiagnosticInsightsRepository _diagnosticRepository;

        public InsightAnalysisService(IDiagnosticInsightsRepository diagnosticRepository)
        {
            _diagnosticRepository = diagnosticRepository;
        }

        public async Task<IReadOnlyList<string>> AnalyzeInsightsAsync(Guid memberId)
        {
            var insights = await _diagnosticRepository.GetInsightsForMemberAsync(memberId);
            var categories = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var i in insights)
            {
                if (!string.IsNullOrWhiteSpace(i.Category))
                {
                    categories.Add(i.Category);
                }
            }

            if (categories.Count == 0)
            {
                categories.Add("general");
            }

            return new List<string>(categories);
        }
    }
}
