using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class MemberIssueSummaryService : IMemberIssueSummaryService
    {
        private readonly IMemberIssueSummaryRepository _repository;

        public MemberIssueSummaryService(IMemberIssueSummaryRepository repository)
        {
            _repository = repository;
        }

        public async Task<MemberIssueSummaryDto?> GetMemberIssueSummaryAsync(Guid memberId)
        {
            var result = await _repository.GetCaseAndInteractionsAsync(memberId);
            if (result.Case == null)
            {
                return null;
            }

            var latestInteraction = result.Interactions
                .OrderByDescending(i => i.OccurredAt)
                .FirstOrDefault();

            var summaryText = result.Case.Title;
            if (latestInteraction != null)
            {
                summaryText += $" - Last contact via {latestInteraction.Channel}: {latestInteraction.Summary}";
            }

            var lastUpdated = result.Case.UpdatedAt ?? result.Case.CreatedAt;
            if (latestInteraction != null && latestInteraction.OccurredAt > lastUpdated)
            {
                lastUpdated = latestInteraction.OccurredAt;
            }

            return new MemberIssueSummaryDto
            {
                MemberId = result.Case.MemberId,
                SummaryText = summaryText,
                CurrentStatus = result.Case.Status,
                LastUpdatedAt = lastUpdated
            };
        }
    }
}
