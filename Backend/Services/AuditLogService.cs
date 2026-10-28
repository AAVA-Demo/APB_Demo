using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly IGuidedActionLogRepository _repository;
        private readonly IInteractionContextProvider _contextProvider;

        public AuditLogService(IGuidedActionLogRepository repository, IInteractionContextProvider contextProvider)
        {
            _repository = repository;
            _contextProvider = contextProvider;
        }

        public async Task<LogGuidedActionExecutionResponseDto> CreateGuidedActionLog(LogGuidedActionExecutionRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.InteractionId))
                throw new GuidedActionLogValidationException("InteractionId is required.");
            if (string.IsNullOrWhiteSpace(request.AgentId))
                throw new GuidedActionLogValidationException("AgentId is required.");
            if (string.IsNullOrWhiteSpace(request.ActionId))
                throw new GuidedActionLogValidationException("ActionId is required.");
            if (string.IsNullOrWhiteSpace(request.ActionName) || request.ActionName.Length > 256)
                throw new GuidedActionLogValidationException("ActionName is required and must be within 256 characters.");

            if (request.ExecutedAt.Kind != DateTimeKind.Utc)
                throw new GuidedActionLogValidationException("ExecutedAt must be a valid UTC timestamp.");

            await _contextProvider.EnsureInteractionExists(request.InteractionId);

            var entity = new GuidedActionExecutionLog
            {
                LogId = Guid.NewGuid().ToString(),
                InteractionId = request.InteractionId,
                AgentId = request.AgentId,
                ActionId = request.ActionId,
                ActionName = request.ActionName,
                ExecutedAt = request.ExecutedAt,
                AdditionalContext = request.AdditionalContext
            };

            await _repository.AddAsync(entity);

            return new LogGuidedActionExecutionResponseDto
            {
                LogId = entity.LogId,
                InteractionId = entity.InteractionId,
                ActionId = entity.ActionId,
                Status = "Success"
            };
        }

        public Task<List<GuidedActionExecutionLog>> GetGuidedActionLogsByInteraction(string interactionId)
        {
            return _repository.GetByInteractionId(interactionId);
        }
    }
}
