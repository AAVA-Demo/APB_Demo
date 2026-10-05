using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticInsightRepository
    {
        Task<List<DiagnosticInsight>> GetByInteractionIdAsync(string interactionId);
    }
}
