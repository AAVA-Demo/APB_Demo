using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IWorkflowRepository
    {
        Task<Workflow?> GetWorkflowByIssueAsync(string issueId);
        Task SaveStepCompletionAsync(WorkflowStepCompletion completion);
    }
}
