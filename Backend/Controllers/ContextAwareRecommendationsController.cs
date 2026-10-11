using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/context-aware-recommendations")]
    [Authorize]
    public class ContextAwareRecommendationsController : ControllerBase
    {
        private readonly IContextAwareRecommendationService _recommendationService;

        public ContextAwareRecommendationsController(IContextAwareRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ContextAwareRecommendationsDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetContextAwareRecommendations(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId is required.");
            }

            try
            {
                var result = await _recommendationService.GetContextAwareRecommendationsAsync(caseId);
                return Ok(result);
            }
            catch (CaseNotFoundException)
            {
                return NotFound("No recommendations available for this case.");
            }
            catch (CaseContextUnavailableException)
            {
                return StatusCode(503, "Case context is temporarily unavailable.");
            }
        }
    }
}
