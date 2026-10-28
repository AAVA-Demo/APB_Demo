using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/interactions/{interactionId}/ai-insights")]
    [Authorize]
    public class AiInsightController : ControllerBase
    {
        private readonly IAiInsightService _aiInsightService;

        public AiInsightController(IAiInsightService aiInsightService)
        {
            _aiInsightService = aiInsightService;
        }

        [HttpGet]
        public async Task<ActionResult<AiInsightsResponseDto>> GetAiInsightsWithConfidence(string interactionId)
        {
            var result = await _aiInsightService.GetInsightsWithConfidence(interactionId);
            return Ok(result);
        }
    }
}
