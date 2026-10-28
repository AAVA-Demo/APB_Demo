using System.Collections.Generic;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationFilter
    {
        List<Recommendation> FilterRecommendations(InteractionContext context, List<Recommendation> recommendations);
    }
}
