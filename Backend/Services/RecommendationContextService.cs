using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendationContextService : IRecommendationContextService
    {
        private readonly IMemberIssueRepository _memberIssueRepository;

        public RecommendationContextService(IMemberIssueRepository memberIssueRepository)
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
                Status = issue.Status,
                PreviousActions = new List<string>()
            };
        }
    }
}
