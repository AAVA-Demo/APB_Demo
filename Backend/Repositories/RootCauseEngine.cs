using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class RootCauseEngine : IRootCauseEngine
    {
        public Task<IReadOnlyList<RootCauseRecommendation>> GenerateRootCauseRecommendationsAsync(string caseId)
        {
            IReadOnlyList<RootCauseRecommendation> recommendations = new List<RootCauseRecommendation>
            {
                new RootCauseRecommendation
                {
                    Id = Guid.NewGuid().ToString(),
                    Description = "Potential misconfiguration in module A.",
                    LikelihoodScore = 0.8,
                    ImpactScore = 0.7
                },
                new RootCauseRecommendation
                {
                    Id = Guid.NewGuid().ToString(),
                    Description = "Intermittent network issues.",
                    LikelihoodScore = 0.6,
                    ImpactScore = 0.9
                }
            };

            return Task.FromResult(recommendations);
        }
    }
}
