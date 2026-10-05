using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationInstructionService : IRemediationInstructionService
    {
        private readonly ISupportCaseRepository _supportCaseRepository;
        private readonly IRemediationEngine _remediationEngine;

        public RemediationInstructionService(ISupportCaseRepository supportCaseRepository, IRemediationEngine remediationEngine)
        {
            _supportCaseRepository = supportCaseRepository;
            _remediationEngine = remediationEngine;
        }

        public async Task<RemediationInstructionResponseDto?> GetRemediationInstructionsAsync(string caseId)
        {
            var supportCase = await _supportCaseRepository.GetByIdAsync(caseId);
            if (supportCase == null)
            {
                return null;
            }

            var steps = await _remediationEngine.GenerateRemediationStepsAsync(caseId);
            var ordered = steps
                .OrderBy(s => s.StepNumber)
                .Select(s => new RemediationStepDto
                {
                    StepNumber = s.StepNumber,
                    Title = s.Title,
                    Description = s.Description
                }).ToList();

            return new RemediationInstructionResponseDto
            {
                CaseId = caseId,
                Steps = ordered,
                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}
