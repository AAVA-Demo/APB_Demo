using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/recommendations")]
    [Authorize]
    public class ContextAwareRecommendationController : ControllerBase
    {
        private readonly IContextAwareRecommendationService _service;

        public ContextAwareRecommendationController(IContextAwareRecommendationService service)
        {
            _service = service;
        }

        [HttpGet("context-aware")]
        public async Task<IActionResult> GetContextAwareRecommendations(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid case identifier.",
                    Data = null
                });
            }

            try
            {
                var dto = await _service.GetContextAwareRecommendationsAsync(caseId);
                return Ok(new ApiResponseWrapper<RecommendationSetDto>
                {
                    Status = "Success",
                    Data = dto,
                    ErrorMessage = null
                });
            }
            catch (CaseNotFoundException)
            {
                return NotFound(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Case context not found.",
                    Data = null
                });
            }
            catch (RecommendationUnavailableException)
            {
                return StatusCode(503, new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Recommendations temporarily unavailable.",
                    Data = null
                });
            }
        }
    }
}
