using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationFeedbackRepository
    {
        RecommendationFeedbackEntity Save(RecommendationFeedbackEntity entity);
    }
}
