using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationWorkflowRepository
    {
        Task<RemediationWorkflow> GetWorkflowByCaseId(string caseId);
        Task SaveWorkflow(RemediationWorkflow workflow);
        Task<RemediationStepInstance> GetStepInstanceById(string stepInstanceId);
        Task UpdateStepInstance(RemediationStepInstance stepInstance);
    }
}
