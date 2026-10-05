using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class ContextAwareInsightsService : IContextAwareInsightsService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IMemberHistoryClient _memberHistoryClient;
        private readonly IAIInsightsGenerator _aiInsightsGenerator;

        public ContextAwareInsightsService(IMemberRepository memberRepository, IMemberHistoryClient memberHistoryClient, IAIInsightsGenerator aiInsightsGenerator)
        {
            _memberRepository = memberRepository;
            _memberHistoryClient = memberHistoryClient;
            _aiInsightsGenerator = aiInsightsGenerator;
        }

        public async Task<ContextAwareInsightsResponseDto?> GetContextAwareInsightsAsync(string memberId, string caseId)
        {
            var member = await _memberRepository.GetByIdAsync(memberId);
            if (member == null)
            {
                return null;
            }

            var history = await _memberHistoryClient.GetMemberHistoryAsync(memberId);
            var insights = await _aiInsightsGenerator.GenerateContextAwareInsightsAsync(memberId, caseId, history);

            return new ContextAwareInsightsResponseDto
            {
                MemberId = memberId,
                CaseId = caseId,
                Insights = insights.ToArray(),
                ReferencedHistory = history.Select(h => new MemberHistoryEventDto
                {
                    EventId = h.EventId,
                    Summary = h.Summary
                }).ToArray(),
                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}
