using Backend.Dtos;

namespace Backend.Services
{
    public interface IRecommendationFeedbackService
    {
        RecommendationFeedbackResponseDto SubmitFeedback(string recommendationId, RecommendationFeedbackRequestDto request);
    }
}
