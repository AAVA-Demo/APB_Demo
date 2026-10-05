using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class MemberContextService : IMemberContextService
    {
        private readonly IMemberContextRepository _repository;

        public MemberContextService(IMemberContextRepository repository)
        {
            _repository = repository;
        }

        public async Task<MemberContextDto?> GetMemberContextAsync(System.Guid memberId, System.Guid caseId)
        {
            var issue = await _repository.GetIssueAsync(memberId, caseId);
            if (issue == null)
            {
                return null;
            }

            var interactions = await _repository.GetRecentInteractionsAsync(memberId, caseId);
            var history = await _repository.GetRelevantHistoryAsync(memberId);

            var dto = new MemberContextDto
            {
                MemberId = memberId,
                CaseId = caseId,
                IssueDescription = issue.IssueDescription,
                RecentActivity = interactions
                    .OrderByDescending(i => i.OccurredAt)
                    .Select(i => new InteractionDto
                    {
                        Id = i.Id,
                        Channel = i.Channel,
                        Summary = i.Summary,
                        OccurredAt = i.OccurredAt
                    }).ToList(),
                RelevantHistory = history
                    .OrderByDescending(h => h.OccurredAt)
                    .Select(h => new HistoryItemDto
                    {
                        Id = h.Id,
                        Description = h.Description,
                        Category = h.Category,
                        OccurredAt = h.OccurredAt
                    }).ToList()
            };

            return dto;
        }
    }
}
