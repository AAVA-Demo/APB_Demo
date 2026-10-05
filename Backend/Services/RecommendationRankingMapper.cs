using System.Collections.Generic;
using System.Linq;
using Backend.Dtos;

namespace Backend.Services
{
    public class RecommendationRankingMapper : IRecommendationRankingMapper
    {
        public RankedRecommendationResponseDto ToRankedResponse(RawRecommendationResponse raw)
        {
            var list = raw.Recommendations.Select(r => new RankedRecommendationDto
            {
                Id = r.Code,
                Description = r.Details,
                Confidence = r.Confidence
            }).ToList();

            var sorted = SortByConfidence(list);

            return new RankedRecommendationResponseDto
            {
                InteractionId = raw.InteractionId,
                Recommendations = sorted
            };
        }

        public List<RankedRecommendationDto> SortByConfidence(List<RankedRecommendationDto> list)
        {
            var sorted = list
                .OrderByDescending(r => r.Confidence)
                .ToList();

            for (var i = 0; i < sorted.Count; i++)
            {
                sorted[i].Rank = i + 1;
            }

            return sorted;
        }
    }
}
