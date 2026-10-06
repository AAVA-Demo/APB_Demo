using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _service;

        public DiagnosticInsightsController(IDiagnosticInsightsService service)
        {
            _service = service;
        }

        [HttpGet("insights")]
        public async Task<ActionResult<DiagnosticInsightsResponseDto>> GetDiagnosticInsightsForCase(string caseId)
        {
            var result = await _service.GetInsights(caseId);
            return Ok(result);
        }

        [HttpGet("insights/stream")]
        public async IAsyncEnumerable<DiagnosticInsightsResponseDto> SubscribeInsightsRefreshStreamForCase(string caseId)
        {
            await foreach (var item in _service.StreamInsights(caseId).ConfigureAwait(false))
            {
                yield return item;
            }
        }

        [HttpPost("insights/refresh")]
        public async Task<ActionResult<InsightsRefreshStatusDto>> TriggerManualInsightsRefreshForCase(string caseId, [FromBody] TriggerManualInsightsRefreshRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(caseId) || request.CaseId != caseId)
            {
                return BadRequest("CaseId is required and must be a valid identifier.");
            }

            var result = await _service.RefreshInsights(caseId);
            return Ok(result);
        }

        [HttpGet("insights/refreshStatus")]
        public async Task<ActionResult<InsightsRefreshStatusDto>> GetInsightsRefreshStatusForCase(string caseId)
        {
            var result = await _service.GetRefreshStatus(caseId);
            return Ok(result);
        }
    }
}
