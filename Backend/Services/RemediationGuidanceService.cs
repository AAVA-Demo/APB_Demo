using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class RemediationGuidanceService : IRemediationGuidanceService
    {
        private readonly IAiRemediationClient _aiClient;
        private readonly IRemediationGuidanceMapper _mapper;

        public RemediationGuidanceService(IAiRemediationClient aiClient, IRemediationGuidanceMapper mapper)
        {
            _aiClient = aiClient;
            _mapper = mapper;
        }

        public async Task<RemediationStepsResponseDto> GetRemediationStepsAsync(string caseId)
        {
            ValidateCaseId(caseId);
            var raw = await _aiClient.GetRemediationPathAsync(caseId);
            var response = _mapper.ToRemediationStepsResponse(raw);
            ValidateSteps(response);
            return response;
        }

        public Task<RemediationStepsResponseDto> BuildRemediationStepsAsync(string caseId)
        {
            return GetRemediationStepsAsync(caseId);
        }

        private static void ValidateCaseId(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new InvalidOperationException("caseId is required");
            }
        }

        private static void ValidateSteps(RemediationStepsResponseDto response)
        {
            if (response.Steps == null || response.Steps.Count == 0)
            {
                throw new InvalidOperationException("No remediation steps available");
            }

            foreach (var step in response.Steps)
            {
                if (step.StepNumber <= 0)
                {
                    throw new InvalidOperationException("Invalid step number");
                }
            }
        }
    }
}
