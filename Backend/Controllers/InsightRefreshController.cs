using System;
using System.Net.Mime;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/insights")]]
    [Authorize]
    public class InsightRefreshController : ControllerBase
    {
        private readonly IInsightRefreshService _service;

        public InsightRefreshController(IInsightRefreshService service)
        {
            _service = service;
        }

        [HttpGet("stream/{interactionId}")]
        public async Task StreamInsights(string interactionId)
        {
            Response.ContentType = "text/event-stream";

            await foreach (var update in _service.SubscribeAsync(interactionId))
            {
                var json = JsonSerializer.Serialize(update);
                await Response.Body.WriteAsync(System.Text.Encoding.UTF8.GetBytes($"data: {json}\n\n"));
                await Response.Body.FlushAsync();
            }
        }

        [HttpPost]
        [Route("/internal/insights/refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<InsightRefreshResponseDto>> TriggerRefresh([FromBody] InsightRefreshRequestDto request)
        {
            try
            {
                var result = await _service.RefreshInsightsAsync(request.InteractionId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
