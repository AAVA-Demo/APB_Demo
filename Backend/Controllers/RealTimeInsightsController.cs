using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/real-time-insights")]
    [Authorize]
    public class RealTimeInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;

        public RealTimeInsightsController(IDiagnosticInsightsService diagnosticInsightsService)
        {
            _diagnosticInsightsService = diagnosticInsightsService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CaseRealTimeInsightsDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRealTimeInsights(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId is required.");
            }

            try
            {
                var result = await _diagnosticInsightsService.GetInsightsAsync(caseId);
                return Ok(result);
            }
            catch (CaseNotFoundException)
            {
                return NotFound("Case not found.");
            }
            catch (TelemetryUnavailableException)
            {
                return StatusCode(503, "Real-time telemetry is unavailable.");
            }
        }
    }
}
