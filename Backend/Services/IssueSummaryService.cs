using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class IssueSummaryService : IIssueSummaryService
    {
        private readonly IDiagnosticRepository _diagnosticRepository;
        private readonly IMemberInteractionRepository _interactionRepository;
        private readonly IssueSummaryEngine _engine;

        public IssueSummaryService(IDiagnosticRepository diagnosticRepository, IMemberInteractionRepository interactionRepository, IssueSummaryEngine engine)
        {
            _diagnosticRepository = diagnosticRepository;
            _interactionRepository = interactionRepository;
            _engine = engine;
        }

        public async Task<IssueSummaryResponse> GetIssueSummaryAsync(string memberId, string issueId)
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                throw new ArgumentException("memberId is required");
            }

            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new ArgumentException("issueId is required");
            }

            var diagnostics = await _diagnosticRepository.FindByMemberIdAndIssueIdAsync(memberId, issueId);
            var interactions = await _interactionRepository.FindByMemberIdAsync(memberId);
            var summary = _engine.GenerateSummary(memberId, issueId, diagnostics, interactions);

            return new IssueSummaryResponse
            {
                MemberId = memberId,
                IssueId = issueId,
                SummaryText = summary.SummaryText,
                LikelyCause = summary.LikelyCause
            };
        }
    }
}
