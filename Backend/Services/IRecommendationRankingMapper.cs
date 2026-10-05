using System.Collections.Generic;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Services
{
    public interface IRecommendationRankingMapper
    {
        RankedRecommendationResponseDto ToRankedResponse(RawRecommendationResponse raw);
        List<RankedRecommendationDto> SortByConfidence(List<RankedRecommendationDto> list);
    }
}
