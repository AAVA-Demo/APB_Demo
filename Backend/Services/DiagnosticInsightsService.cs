using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly ISupportCaseRepository _supportCaseRepository;
        private readonly IAIInsightsGenerator _aiInsightsGenerator;

        public DiagnosticInsightsService(ISupportCaseRepository supportCaseRepository, IAIInsightsGenerator aiInsightsGenerator)
        {
            _supportCaseRepository = supportCaseRepository;
            _aiInsightsGenerator = aiInsightsGenerator;
        }

        public async Task<DiagnosticInsightsResponseDto?> GetDiagnosticInsightsAsync(string caseId)
        {
            var supportCase = await _supportCaseRepository.GetByIdAsync(caseId);
            if (supportCase == null)
            {
                return null;
            }

            var insights = await _aiInsightsGenerator.GenerateDiagnosticInsightsAsync(caseId);
            var generatedAt = DateTime.UtcNow;

            var entity = new DiagnosticInsight
            {
                Id = Guid.NewGuid().ToString(),
                CaseId = caseId,
                InsightsPayload = string.Join("|", insights),
                GeneratedAt = generatedAt
            };

            await _supportCaseRepository.AddDiagnosticInsightAsync(entity);

            return new DiagnosticInsightsResponseDto
            {
                CaseId = caseId,
                Insights = insights.ToArray(),
                GeneratedAt = generatedAt
            };
        }
    }
}
