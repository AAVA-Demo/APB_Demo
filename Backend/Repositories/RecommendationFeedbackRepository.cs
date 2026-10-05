using Backend.Data;
using Backend.Models;

namespace Backend.Repositories
{
    public class RecommendationFeedbackRepository : IRecommendationFeedbackRepository
    {
        private readonly AppDbContext _dbContext;

        public RecommendationFeedbackRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public RecommendationFeedbackEntity Save(RecommendationFeedbackEntity entity)
        {
            _dbContext.RecommendationFeedback.Add(entity);
            _dbContext.SaveChanges();
            return entity;
        }
    }
}
