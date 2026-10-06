using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationInstructionsService : IRemediationInstructionsService
    {
        private readonly IRemediationInstructionsRepository _repository;
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;
        private readonly IRemediationEngineClient _engineClient;

        public RemediationInstructionsService(IRemediationInstructionsRepository repository, IDiagnosticInsightsService diagnosticInsightsService, IRemediationEngineClient engineClient)
        {
            _repository = repository;
            _diagnosticInsightsService = diagnosticInsightsService;
            _engineClient = engineClient;
        }

        public async Task<RemediationInstructionsResponseDto> GetInstructions(string issueId)
        {
            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new InvalidOperationException("IssueId is required and must reference an existing issue.");
            }

            _diagnosticInsightsService.ValidateIssueExists(issueId);
            var instructions = await _repository.GetInstructionsByIssueId(issueId);
            if (instructions == null || !instructions.Any())
            {
                instructions = await _engineClient.GetInstructionsForIssue(issueId);
                await _repository.SaveInstructions(issueId, instructions);
            }

            var dto = new RemediationInstructionsResponseDto
            {
                IssueId = issueId,
                Instructions = instructions.OrderBy(i => i.Order).Select(MapInstructionToDto).ToList()
            };
            return dto;
        }

        public async Task<RemediationInstructionsRefreshStatusDto> RefreshInstructions(string issueId)
        {
            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new InvalidOperationException("IssueId is required and must reference an existing issue.");
            }

            _diagnosticInsightsService.ValidateIssueExists(issueId);
            var instructions = await _engineClient.GetInstructionsForIssue(issueId);
            await _repository.SaveInstructions(issueId, instructions);

            return new RemediationInstructionsRefreshStatusDto
            {
                IssueId = issueId,
                RefreshedAtUtc = DateTime.UtcNow,
                InstructionCount = instructions.Count
            };
        }

        private static RemediationInstructionDto MapInstructionToDto(RemediationInstruction instruction)
        {
            return new RemediationInstructionDto
            {
                InstructionId = instruction.InstructionId,
                Order = instruction.Order,
                Title = instruction.Title,
                Description = instruction.Description
            };
        }
    }
}
