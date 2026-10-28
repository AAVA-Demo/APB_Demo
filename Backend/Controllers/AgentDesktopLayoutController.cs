using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/agent-desktop")]
    [Authorize]
    public class AgentDesktopLayoutController : ControllerBase
    {
        private readonly IAgentDesktopLayoutService _layoutService;

        public AgentDesktopLayoutController(IAgentDesktopLayoutService layoutService)
        {
            _layoutService = layoutService;
        }

        [HttpGet("layout")]
        public async Task<ActionResult<AgentDesktopLayoutConfigurationDto>> GetAgentDesktopLayout()
        {
            var layout = await _layoutService.GetLayoutConfiguration();
            return Ok(layout);
        }

        [HttpGet("ai-panel/configuration")]
        public async Task<ActionResult<AiDiagnosticPanelConfigurationDto>> GetAiDiagnosticPanelConfiguration()
        {
            var config = await _layoutService.GetAiDiagnosticPanelConfiguration();
            return Ok(config);
        }
    }
}
