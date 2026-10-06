using System.Threading.Tasks;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class MemberContextService : IMemberContextService
    {
        private readonly IMemberIssueRepository _memberIssueRepository;
        private readonly IMemberProfileRepository _memberProfileRepository;
        private readonly IInteractionHistoryRepository _interactionHistoryRepository;

        public MemberContextService(IMemberIssueRepository memberIssueRepository, IMemberProfileRepository memberProfileRepository, IInteractionHistoryRepository interactionHistoryRepository)
        {
            _memberIssueRepository = memberIssueRepository;
            _memberProfileRepository = memberProfileRepository;
            _interactionHistoryRepository = interactionHistoryRepository;
        }

        public async Task<MemberContext?> GetMemberContext(string memberIssueId)
        {
            var issue = await _memberIssueRepository.GetByIdAsync(memberIssueId);
            if (issue == null)
            {
                return null;
            }

            var profile = await _memberProfileRepository.GetByIdAsync(issue.MemberId);
            var history = await _interactionHistoryRepository.GetLatestByMemberIdAsync(issue.MemberId);

            return new MemberContext
            {
                MemberId = issue.MemberId,
                IssueHistorySummary = history?.Summary ?? string.Empty,
                NonSensitiveProfileAttributes = profile?.NonSensitiveAttributes ?? string.Empty
            };
        }
    }
}
