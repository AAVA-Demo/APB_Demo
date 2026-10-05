using System.Linq;
using Backend.Dtos;

namespace Backend.Services
{
    public class RemediationGuidanceMapper : IRemediationGuidanceMapper
    {
        public RemediationStepsResponseDto ToRemediationStepsResponse(RawRemediationPathResponse raw)
        {
            var steps = raw.Steps.Select((s, index) => new RemediationStepDto
            {
                StepNumber = s.StepNumber ?? index + 1,
                Instruction = s.Instruction
            }).OrderBy(s => s.StepNumber).ToList();

            return new RemediationStepsResponseDto
            {
                CaseId = raw.CaseId,
                Steps = steps
            };
        }
    }
}
