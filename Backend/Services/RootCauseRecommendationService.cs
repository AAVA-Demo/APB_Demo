using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RootCauseRecommendationService : IRootCauseRecommendationService
    {
        private readonly ISupportCaseRepository _supportCaseRepository;
        private readonly IRootCauseEngine _rootCauseEngine;

        public RootCauseRecommendationService(ISupportCaseRepository supportCaseRepository, IRootCauseEngine rootCauseEngine)
        {
            _supportCaseRepository = supportCaseRepository;
            _rootCauseEngine = rootCauseEngine;
        }

        public async Task<RootCauseRecommendationResponseDto?> GetRootCauseRecommendationsAsync(string caseId)
        {
            var supportCase = await _supportCaseRepository.GetByIdAsync(caseId);
            if (supportCase == null)
            {
                return null;
            }

            var recommendations = await _rootCauseEngine.GenerateRootCauseRecommendationsAsync(caseId);

            var sorted = recommendations
                .OrderByDescending(r => r.LikelihoodScore + r.ImpactScore)
                .Select((r, index) => new RootCauseRecommendationDto
                {
                    Id = r.Id,
                    Description = r.Description,
                    LikelihoodScore = r.LikelihoodScore,
                    ImpactScore = r.ImpactScore,
                    PriorityRank = index + 1
                }).ToArray();

            return new RootCauseRecommendationResponseDto
            {
                CaseId = caseId,
                Recommendations = sorted
            };
        }
    }
}
