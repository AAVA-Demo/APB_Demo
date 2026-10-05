using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class ResolutionOutcomeService : IResolutionOutcomeService
    {
        private readonly IResolutionOutcomeRepository _repository;

        public ResolutionOutcomeService(IResolutionOutcomeRepository repository)
        {
            _repository = repository;
        }

        public async Task<ResolutionOutcomeDto> CreateOutcomeAsync(string issueId, string agentId, CreateResolutionOutcomeRequest request)
        {
            var entity = new ResolutionOutcome
            {
                Id = Guid.NewGuid(),
                IssueId = issueId,
                Outcome = request.Outcome,
                Comments = request.Comments,
                AgentId = agentId,
                CreatedAt = DateTime.UtcNow
            };

            var saved = await _repository.SaveAsync(entity);
            return MapToDto(saved);
        }

        public async Task<ResolutionOutcomeDto?> GetOutcomeAsync(string issueId)
        {
            var entity = await _repository.GetByIssueAsync(issueId);
            return entity == null ? null : MapToDto(entity);
        }

        public async Task<ResolutionOutcomeDto?> UpdateOutcomeAsync(string issueId, string agentId, CreateResolutionOutcomeRequest request)
        {
            var entity = await _repository.GetByIssueAndAgentAsync(issueId, agentId);
            if (entity == null)
            {
                return null;
            }

            entity.Outcome = request.Outcome;
            entity.Comments = request.Comments;
            entity.UpdatedAt = DateTime.UtcNow;

            var saved = await _repository.SaveAsync(entity);
            return MapToDto(saved);
        }

        private ResolutionOutcomeDto MapToDto(ResolutionOutcome entity)
        {
            return new ResolutionOutcomeDto
            {
                Id = entity.Id,
                IssueId = entity.IssueId,
                Outcome = entity.Outcome,
                Comments = entity.Comments,
                AgentId = entity.AgentId,
                RecordedAt = entity.UpdatedAt ?? entity.CreatedAt
            };
        }
    }
}
