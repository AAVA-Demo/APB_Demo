using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/insights")]
    [Authorize]
    public class InsightsController : ControllerBase
    {
        private readonly IInsightRepository _insightRepository;
        private readonly IInsightDtoFactory _insightDtoFactory;

        public InsightsController(IInsightRepository insightRepository, IInsightDtoFactory insightDtoFactory)
        {
            _insightRepository = insightRepository;
            _insightDtoFactory = insightDtoFactory;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CaseInsightsDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetInsightsWithConfidence(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId is required.");
            }

            try
            {
                var insights = await _insightRepository.GetInsightsAsync(caseId);
                var remediations = await _insightRepository.GetRemediationsAsync(caseId);
                var dto = _insightDtoFactory.Build(caseId, insights, remediations);
                return Ok(dto);
            }
            catch (CaseNotFoundException)
            {
                return NotFound("No insights available for this case.");
            }
            catch (InsightDataUnavailableException)
            {
                return StatusCode(503, "Insight data is temporarily unavailable.");
            }
        }
    }
}
