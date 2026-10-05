using System;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendationFeedbackService : IRecommendationFeedbackService
    {
        private readonly IRecommendationFeedbackRepository _repository;

        public RecommendationFeedbackService(IRecommendationFeedbackRepository repository)
        {
            _repository = repository;
        }

        public RecommendationFeedbackResponseDto SubmitFeedback(string recommendationId, RecommendationFeedbackRequestDto request)
        {
            var entity = new RecommendationFeedbackEntity
            {
                RecommendationId = recommendationId,
                CaseId = request.CaseId,
                MemberId = request.MemberId,
                FeedbackType = request.FeedbackType,
                Comment = request.Comment,
                CreatedAt = DateTimeOffset.UtcNow
            };

            _repository.Save(entity);

            return new RecommendationFeedbackResponseDto
            {
                RecommendationId = recommendationId,
                FeedbackType = request.FeedbackType,
                Status = "UPDATED",
                Timestamp = entity.CreatedAt
            };
        }
    }
}
