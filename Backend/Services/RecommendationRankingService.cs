using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class RecommendationRankingService : IRecommendationRankingService
    {
        private readonly IAiRecommendationClient _aiClient;
        private readonly IRecommendationRankingMapper _mapper;

        public RecommendationRankingService(IAiRecommendationClient aiClient, IRecommendationRankingMapper mapper)
        {
            _aiClient = aiClient;
            _mapper = mapper;
        }

        public async Task<RankedRecommendationResponseDto> GetRankedRecommendationsAsync(string interactionId)
        {
            ValidateInteractionId(interactionId);
            var raw = await _aiClient.GetRecommendationsAsync(interactionId);
            var response = _mapper.ToRankedResponse(raw);
            ValidateRecommendations(response);
            return response;
        }

        public Task<RankedRecommendationResponseDto> RankRecommendationsAsync(RecommendationRankRequestDto request)
        {
            ValidateInteractionId(request.InteractionId);
            if (request.RawRecommendations == null || request.RawRecommendations.Count == 0)
            {
                throw new InvalidOperationException("No recommendations available");
            }

            var raw = new RawRecommendationResponse
            {
                InteractionId = request.InteractionId,
                Recommendations = request.RawRecommendations.ConvertAll(r => new RawRecommendationItem
                {
                    Code = r.Code,
                    Details = r.Details,
                    Confidence = r.Confidence
                })
            };

            var response = _mapper.ToRankedResponse(raw);
            ValidateRecommendations(response);
            return Task.FromResult(response);
        }

        private static void ValidateInteractionId(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InvalidOperationException("interactionId is required");
            }
        }

        private static void ValidateRecommendations(RankedRecommendationResponseDto response)
        {
            if (response.Recommendations == null || response.Recommendations.Count == 0)
            {
                throw new InvalidOperationException("No recommendations available");
            }

            foreach (var rec in response.Recommendations)
            {
                if (rec.Confidence < 0.0 || rec.Confidence > 1.0)
                {
                    throw new InvalidOperationException("Invalid confidence score");
                }
            }
        }
    }
}
