using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseEventRepository
    {
        Task<List<CaseEvent>> GetRecentEventsAsync(string caseId);
    }
}
