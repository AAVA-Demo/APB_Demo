using System.Text.RegularExpressions;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class MemberImpactPrioritizationService : IMemberImpactPrioritizationService
    {
        private readonly IMemberIssueRepository _repository;
        private readonly MemberImpactAssessmentEngine _engine;

        public MemberImpactPrioritizationService(IMemberIssueRepository repository, MemberImpactAssessmentEngine engine)
        {
            _repository = repository;
            _engine = engine;
        }

        public async Task<MemberImpactIssuesResponse> GetPrioritizedIssuesAsync(string memberId)
        {
            ValidateMemberId(memberId);
            var issues = await _repository.FindActiveIssuesByMemberIdAsync(memberId);

            var recommendations = await _repository.FindRecommendationsByMemberIdAsync(memberId);
            var issueDtos = new List<MemberImpactIssueDto>();

            foreach (var issue in issues)
            {
                var impactScore = _engine.CalculateIssueImpact(issue);
                var impactLevel = _engine.DeriveImpactLevel(impactScore);
                var issueRecs = recommendations.Where(r => r.IssueId == issue.Id).ToList();

                var recDtos = issueRecs.Select(r =>
                {
                    var score = _engine.CalculateRecommendationImpact(r);
                    var level = _engine.DeriveImpactLevel(score);
                    return new MemberImpactRecommendationDto
                    {
                        RecommendationId = r.Id,
                        Description = r.Description,
                        ImpactScore = score,
                        ImpactLevel = level
                    };
                }).OrderByDescending(r => r.ImpactScore).ToList();

                issueDtos.Add(new MemberImpactIssueDto
                {
                    IssueId = issue.Id,
                    Title = issue.Title,
                    ImpactScore = impactScore,
                    ImpactLevel = impactLevel,
                    Recommendations = recDtos
                });
            }

            var orderedIssues = issueDtos.OrderByDescending(i => i.ImpactScore).ToList();

            return new MemberImpactIssuesResponse
            {
                MemberId = memberId,
                Issues = orderedIssues
            };
        }

        public async Task<MemberImpactRecommendationsResponse> GetPrioritizedRecommendationsAsync(string memberId)
        {
            ValidateMemberId(memberId);
            var recommendations = await _repository.FindRecommendationsByMemberIdAsync(memberId);

            var recDtos = recommendations.Select(r =>
            {
                var score = _engine.CalculateRecommendationImpact(r);
                var level = _engine.DeriveImpactLevel(score);
                return new MemberImpactRecommendationDto
                {
                    RecommendationId = r.Id,
                    Description = r.Description,
                    ImpactScore = score,
                    ImpactLevel = level
                };
            }).OrderByDescending(r => r.ImpactScore).ToList();

            return new MemberImpactRecommendationsResponse
            {
                MemberId = memberId,
                Recommendations = recDtos
            };
        }

        private void ValidateMemberId(string memberId)
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                throw new ArgumentException("memberId is required");
            }

            if (!Regex.IsMatch(memberId, "^[A-Za-z0-9\\-]+$"))
            {
                throw new ArgumentException("memberId format is invalid");
            }
        }
    }
}
