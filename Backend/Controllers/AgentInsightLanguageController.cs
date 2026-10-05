using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/agent-insights")]
    [Authorize]
    public class AgentInsightLanguageController : ControllerBase
    {
        private readonly IAgentInsightLanguageService _service;

        public AgentInsightLanguageController(IAgentInsightLanguageService service)
        {
            _service = service;
        }

        [HttpGet("{interactionId}")]
        public async Task<ActionResult<AgentInsightResponseDto>> GetAgentFriendlyInsights(string interactionId)
        {
            try
            {
                var result = await _service.GetAgentFriendlyInsightsAsync(interactionId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("/internal/agent-insights/transform")]
        [AllowAnonymous]
        public async Task<ActionResult<AgentInsightResponseDto>> TransformRawInsights([FromBody] AgentInsightTransformRequestDto request)
        {
            try
            {
                var result = await _service.TransformRawInsightsAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
