using System.Text.Json;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _service;

        public DiagnosticInsightsController(IDiagnosticInsightsService service)
        {
            _service = service;
        }

        [HttpGet("members/{memberId}/current-insights")]
        public async Task<ActionResult<DiagnosticInsightsResponse>> GetCurrentInsights(string memberId)
        {
            try
            {
                var result = await _service.GetCurrentInsightsAsync(memberId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("members/{memberId}/insights-stream")]
        public async Task StreamInsights(string memberId)
        {
            Response.ContentType = "text/event-stream";
            var cancellationToken = HttpContext.RequestAborted;

            await foreach (var insight in _service.SubscribeInsightsStreamAsync(memberId, cancellationToken))
            {
                var json = JsonSerializer.Serialize(insight);
                await Response.WriteAsync($"data: {json}\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }
        }
    }
}
