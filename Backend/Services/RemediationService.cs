using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationService : IRemediationService
    {
        private readonly IRemediationRepository _repository;
        private readonly IInsightAnalysisService _analysisService;

        public RemediationService(IRemediationRepository repository, IInsightAnalysisService analysisService)
        {
            _repository = repository;
            _analysisService = analysisService;
        }

        public async Task<IReadOnlyList<RemediationStepDto>> GetRemediationStepsAsync(Guid memberId)
        {
            var existing = await _repository.GetStepsForMemberAsync(memberId);
            if (existing.Count == 0)
            {
                var rootCauses = await _analysisService.AnalyzeInsightsAsync(memberId);
                existing = await _repository.GetOrCreateStepsAsync(memberId, rootCauses);
            }

            return existing
                .OrderBy(s => s.Order)
                .Select(ToDto)
                .ToList();
        }

        public async Task<RemediationStepDto?> UpdateRemediationStepStatusAsync(Guid memberId, Guid stepId, UpdateRemediationStepStatusRequest request)
        {
            var step = await _repository.GetStepAsync(memberId, stepId);
            if (step == null)
            {
                return null;
            }

            step.IsCompleted = request.IsCompleted;
            step.CompletedAt = request.IsCompleted ? DateTime.UtcNow : null;
            await _repository.SaveAsync(step);

            return ToDto(step);
        }

        private static RemediationStepDto ToDto(RemediationStep entity)
        {
            return new RemediationStepDto
            {
                Id = entity.Id,
                Order = entity.Order,
                Title = entity.Title,
                Description = entity.Description,
                IsCompleted = entity.IsCompleted
            };
        }
    }
}
