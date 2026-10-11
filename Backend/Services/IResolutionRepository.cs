using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IResolutionRepository
    {
        Task<List<ResolutionOption>> GetOptionsAsync(string caseId);
    }
}
