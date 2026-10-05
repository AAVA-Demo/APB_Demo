using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/support/cases/{caseId}/root-cause-recommendations")]
    [Authorize]
    public class RootCauseRecommendationController : ControllerBase
    {
        private readonly IRootCauseRecommendationService _rootCauseRecommendationService;

        public RootCauseRecommendationController(IRootCauseRecommendationService rootCauseRecommendationService)
        {
            _rootCauseRecommendationService = rootCauseRecommendationService;
        }

        [HttpGet]
        public async Task<ActionResult<RootCauseRecommendationResponseDto>> GetRootCauseRecommendations(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId is required");
            }

            var response = await _rootCauseRecommendationService.GetRootCauseRecommendationsAsync(caseId);
            if (response == null)
            {
                return NotFound("Case not found");
            }

            return Ok(response);
        }
    }
}
