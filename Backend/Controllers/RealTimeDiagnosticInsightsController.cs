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
    [Route("api/real-time/cases/{caseId}")]
    [Authorize]
    public class RealTimeDiagnosticInsightsController : ControllerBase
    {
        private readonly IRealTimeDiagnosticInsightsService _service;

        public RealTimeDiagnosticInsightsController(IRealTimeDiagnosticInsightsService service)
        {
            _service = service;
        }

        [HttpPost("analyze")]
        public async Task<ActionResult<RealTimeInsightsAnalysisResponseDto>> AnalyzeCaseRealTime(string caseId, [FromBody] AnalyzeCaseRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(caseId) || caseId != request.CaseId)
            {
                return BadRequest("CaseId is required and must reference an existing member case.");
            }

            var result = await _service.AnalyzeCase(caseId);
            return Ok(result);
        }

        [HttpGet("insights")]
        public async Task<ActionResult<RealTimeInsightsResponseDto>> GetRealTimeInsightsForCase(string caseId)
        {
            var result = await _service.GetInsights(caseId);
            return Ok(result);
        }

        [HttpGet("insights/stream")]
        public async IAsyncEnumerable<RealTimeInsightsResponseDto> SubscribeRealTimeInsightsStreamForCase(string caseId)
        {
            await foreach (var item in _service.StreamInsights(caseId).ConfigureAwait(false))
            {
                yield return item;
            }
        }
    }
}
