using System.Threading.Tasks;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class IssueContextService : IIssueContextService
    {
        private readonly IMemberIssueRepository _memberIssueRepository;

        public IssueContextService(IMemberIssueRepository memberIssueRepository)
        {
            _memberIssueRepository = memberIssueRepository;
        }

        public async Task<IssueContext?> GetIssueContext(string memberIssueId)
        {
            var issue = await _memberIssueRepository.GetByIdAsync(memberIssueId);
            if (issue == null)
            {
                return null;
            }

            return new IssueContext
            {
                MemberIssueId = issue.Id,
                DataSnapshot = "Snapshot for issue " + issue.Id
            };
        }
    }
}
