using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class RawRemediationPathResponse
    {
        public string CaseId { get; set; } = string.Empty;
        public List<RawRemediationStepItem> Steps { get; set; } = new();
    }

    public class RawRemediationStepItem
    {
        public int? StepNumber { get; set; }
        public string Instruction { get; set; } = string.Empty;
    }

    public interface IAiRemediationClient
    {
        Task<RawRemediationPathResponse> GetRemediationPathAsync(string caseId);
    }
}
