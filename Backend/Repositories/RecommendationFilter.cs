using System.Collections.Generic;
using Backend.Models;

namespace Backend.Repositories
{
    public class RecommendationFilter : IRecommendationFilter
    {
        public List<Recommendation> FilterRecommendations(InteractionContext context, List<Recommendation> recommendations)
        {
            return recommendations;
        }
    }
}
