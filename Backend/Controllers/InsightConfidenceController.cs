using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class InsightConfidenceController : ControllerBase
    {
        private readonly IInsightConfidenceService _service;

        public InsightConfidenceController(IInsightConfidenceService service)
        {
            _service = service;
        }

        [HttpGet("cases/{caseId}/insights-with-confidence")]
        public async Task<ActionResult<InsightsWithConfidenceResponseDto>> GetInsightsWithConfidenceForCase(string caseId)
        {
            var result = await _service.GetInsightsWithConfidence(caseId);
            return Ok(result);
        }

        [HttpGet("insights/{insightId}/confidence")]
        public async Task<ActionResult<InsightConfidenceDetailsDto>> GetInsightConfidenceDetails(string insightId)
        {
            var result = await _service.GetConfidenceDetails(insightId);
            return Ok(result);
        }
    }
}
