using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/interactions/{interactionId}/recommendations")]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;

        public RecommendationController(IRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        [HttpGet]
        public async Task<ActionResult<ContextAwareRecommendationsResponseDto>> GetContextAwareRecommendations(string interactionId)
        {
            var result = await _recommendationService.GetContextAwareRecommendations(interactionId);
            return Ok(result);
        }
    }
}
