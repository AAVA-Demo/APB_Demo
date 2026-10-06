using System.Threading.Tasks;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class IssueIdentificationService : IIssueIdentificationService
    {
        private readonly IIdentifiedIssueRepository _identifiedIssueRepository;

        public IssueIdentificationService(IIdentifiedIssueRepository identifiedIssueRepository)
        {
            _identifiedIssueRepository = identifiedIssueRepository;
        }

        public async Task<IdentifiedIssue?> GetIdentifiedIssue(string memberIssueId)
        {
            return await _identifiedIssueRepository.GetByMemberIssueIdAsync(memberIssueId);
        }
    }
}
