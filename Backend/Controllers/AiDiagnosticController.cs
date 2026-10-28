using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/interactions/{interactionId}/diagnostic-insights")]
    [Authorize]
    public class AiDiagnosticController : ControllerBase
    {
        private readonly IAiDiagnosticService _aiDiagnosticService;

        public AiDiagnosticController(IAiDiagnosticService aiDiagnosticService)
        {
            _aiDiagnosticService = aiDiagnosticService;
        }

        [HttpGet]
        public async Task<ActionResult<RealTimeDiagnosticInsightsResponseDto>> GetRealTimeDiagnosticInsights(string interactionId)
        {
            var result = await _aiDiagnosticService.GetRealTimeDiagnosticInsights(interactionId);
            return Ok(result);
        }
    }
}
