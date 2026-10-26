using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}/insights/{insightId}/recommendations/{recommendationId}")]
    [Authorize]
    public class RecommendationExplanationController : ControllerBase
    {
        private readonly IRecommendationExplanationService _service;

        public RecommendationExplanationController(IRecommendationExplanationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<RecommendationExplanationDto>> GetRecommendationExplanation(
            string caseId,
            string insightId,
            string recommendationId)
        {
            try
            {
                var dto = await _service.GetRecommendationExplanation(caseId, insightId, recommendationId);
                return Ok(dto);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (CaseNotFoundException)
            {
                return NotFound();
            }
            catch (InsightNotFoundException)
            {
                return NotFound();
            }
            catch (RecommendationNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
