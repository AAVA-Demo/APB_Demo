using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAgentInsightRepository
    {
        Task<List<AgentInsight>> GetInsightsByInteractionIdAsync(string interactionId);
        Task<List<AgentRemediationStep>> GetStepsByInteractionIdAsync(string interactionId);
    }
}
