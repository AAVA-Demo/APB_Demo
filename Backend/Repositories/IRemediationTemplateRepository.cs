using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationTemplateRepository
    {
        Task<List<RemediationTemplate>> GetByIssueCodeAsync(string issueCode);
    }
}
