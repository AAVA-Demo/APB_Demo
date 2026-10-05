using System;
using System.Collections.Concurrent;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/support/cases/{caseId}/insights")]
    [Authorize]
    public class DiagnosticInsightsNotificationController : ControllerBase
    {
        private readonly IDiagnosticInsightsUpdateService _diagnosticInsightsUpdateService;

        public DiagnosticInsightsNotificationController(IDiagnosticInsightsUpdateService diagnosticInsightsUpdateService)
        {
            _diagnosticInsightsUpdateService = diagnosticInsightsUpdateService;
        }

        [HttpPost("notify")]
        public async Task<ActionResult<InsightsUpdateNotificationResponseDto>> NotifyInsightsUpdate(string caseId, [FromBody] InsightsUpdateNotificationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId is required");
            }

            if (request == null || string.IsNullOrWhiteSpace(request.ChangeType))
            {
                return BadRequest("Unsupported change type");
            }

            var success = await _diagnosticInsightsUpdateService.NotifyInsightsUpdateAsync(caseId, request);
            if (!success)
            {
                return NotFound("Case not found");
            }

            var response = new InsightsUpdateNotificationResponseDto
            {
                CaseId = caseId,
                Status = "QUEUED"
            };

            return Ok(response);
        }

        [HttpGet("stream")]
        public async Task StreamInsights(string caseId)
        {
            Response.Headers.Add("Content-Type", "text/event-stream");
            Response.Headers.Add("Cache-Control", "no-cache");
            Response.Headers.Add("Connection", "keep-alive");

            var writer = new System.IO.StreamWriter(Response.Body);
            var channel = _diagnosticInsightsUpdateService.RegisterListener(caseId);

            await foreach (var evt in channel.ReadAllAsync())
            {
                var json = JsonSerializer.Serialize(evt);
                await writer.WriteAsync($"data: {json}\n\n");
                await writer.FlushAsync();
            }
        }
    }
}
