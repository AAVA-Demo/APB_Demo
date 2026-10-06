using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class AiDiagnosticService : IAiDiagnosticService
    {
        private readonly ICaseDataRepository _caseDataRepository;
        private readonly IAiEngineClient _aiEngineClient;

        public AiDiagnosticService(ICaseDataRepository caseDataRepository, IAiEngineClient aiEngineClient)
        {
            _caseDataRepository = caseDataRepository;
            _aiEngineClient = aiEngineClient;
        }

        public async Task<DiagnosticInsightDto> GetRealTimeDiagnosticsAsync(string caseId)
        {
            var caseData = await _caseDataRepository.GetCaseByIdAsync(caseId);
            if (caseData == null)
            {
                throw new CaseNotFoundException();
            }

            var result = await _aiEngineClient.GetDiagnosticsAsync(caseData);
            if (result == null || result.Items == null)
            {
                throw new DiagnosticsNotAvailableException();
            }

            var dto = new DiagnosticInsightDto
            {
                CaseId = result.CaseId,
                GeneratedBy = result.EngineName,
                GeneratedAtUtc = result.GeneratedAtUtc,
                Insights = result.Items.Select(i => new DiagnosticItemDto
                {
                    Code = i.Code,
                    Title = i.Title,
                    Description = i.Description,
                    Severity = i.Severity,
                    LastUpdatedUtc = i.LastUpdatedUtc
                }).ToList()
            };

            return dto;
        }
    }
}
