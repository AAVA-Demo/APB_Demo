using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/support/cases/{caseId}/metrics")]
    [Authorize]
    public class CaseResolutionMetricsController : ControllerBase
    {
        private readonly ICaseResolutionMetricsService _caseResolutionMetricsService;

        public CaseResolutionMetricsController(ICaseResolutionMetricsService caseResolutionMetricsService)
        {
            _caseResolutionMetricsService = caseResolutionMetricsService;
        }

        [HttpPost]
        public async Task<ActionResult<CaseResolutionMetricsResponseDto>> RecordMetrics(string caseId, [FromBody] CaseResolutionMetricsRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _caseResolutionMetricsService.RecordMetricsAsync(caseId, request);
            if (result == null)
            {
                return Conflict("Metrics already recorded or case not found");
            }

            return CreatedAtAction(nameof(GetMetrics), new { caseId = result.CaseId }, result);
        }

        [HttpGet]
        public async Task<ActionResult<CaseResolutionMetricsResponseDto>> GetMetrics(string caseId)
        {
            var result = await _caseResolutionMetricsService.GetMetricsAsync(caseId);
            if (result == null)
            {
                return NotFound("Case not found");
            }

            return Ok(result);
        }
    }
}
