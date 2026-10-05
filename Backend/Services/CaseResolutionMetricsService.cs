using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class CaseResolutionMetricsService : ICaseResolutionMetricsService
    {
        private readonly ICaseResolutionMetricsRepository _caseResolutionMetricsRepository;
        private readonly ISupportCaseRepository _supportCaseRepository;

        public CaseResolutionMetricsService(ICaseResolutionMetricsRepository caseResolutionMetricsRepository, ISupportCaseRepository supportCaseRepository)
        {
            _caseResolutionMetricsRepository = caseResolutionMetricsRepository;
            _supportCaseRepository = supportCaseRepository;
        }

        public async Task<CaseResolutionMetricsResponseDto?> RecordMetricsAsync(string caseId, CaseResolutionMetricsRequestDto request)
        {
            var supportCase = await _supportCaseRepository.GetByIdAsync(caseId);
            if (supportCase == null)
            {
                return null;
            }

            var existing = await _caseResolutionMetricsRepository.GetByCaseIdAsync(caseId);
            if (existing != null)
            {
                return null;
            }

            var entity = new CaseResolutionMetrics
            {
                Id = Guid.NewGuid().ToString(),
                CaseId = caseId,
                HandleTimeSeconds = request.HandleTimeSeconds,
                StepsFollowed = request.StepsFollowed,
                AiGuidanceUsed = request.AiGuidanceUsed,
                RecordedAt = DateTime.UtcNow
            };

            await _caseResolutionMetricsRepository.AddAsync(entity);

            return new CaseResolutionMetricsResponseDto
            {
                CaseId = caseId,
                HandleTimeSeconds = entity.HandleTimeSeconds,
                StepsFollowed = entity.StepsFollowed,
                AiGuidanceUsed = entity.AiGuidanceUsed,
                RecordedAt = entity.RecordedAt
            };
        }

        public async Task<CaseResolutionMetricsResponseDto?> GetMetricsAsync(string caseId)
        {
            var entity = await _caseResolutionMetricsRepository.GetByCaseIdAsync(caseId);
            if (entity == null)
            {
                return null;
            }

            return new CaseResolutionMetricsResponseDto
            {
                CaseId = entity.CaseId,
                HandleTimeSeconds = entity.HandleTimeSeconds,
                StepsFollowed = entity.StepsFollowed,
                AiGuidanceUsed = entity.AiGuidanceUsed,
                RecordedAt = entity.RecordedAt
            };
        }
    }
}
