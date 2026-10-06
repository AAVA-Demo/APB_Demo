using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IIssueIdentificationService
    {
        Task<IdentifiedIssue?> GetIdentifiedIssue(string memberIssueId);
    }
}
