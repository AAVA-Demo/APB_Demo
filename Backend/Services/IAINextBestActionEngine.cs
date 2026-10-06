using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IAINextBestActionEngine
    {
        Task<NextBestActionInternal?> GetNextBestAction(IssueContext context);
    }

    public class NextBestActionInternal
    {
        public string PromptText { get; set; } = string.Empty;
        public string StepCode { get; set; } = string.Empty;
    }
}
