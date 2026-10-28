using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/interactions/{interactionId}/guided-actions")]
    [Authorize]
    public class GuidedActionLogController : ControllerBase
    {
        private readonly IAuditLogService _auditLogService;

        public GuidedActionLogController(IAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        [HttpPost("log")]
        public async Task<ActionResult<LogGuidedActionExecutionResponseDto>> PostLogGuidedActionExecution(string interactionId, [FromBody] LogGuidedActionExecutionRequestDto request)
        {
            request.InteractionId = interactionId;
            var response = await _auditLogService.CreateGuidedActionLog(request);
            return Ok(response);
        }

        [HttpGet("logs")]
        public async Task<ActionResult<List<GuidedActionExecutionLog>>> GetGuidedActionExecutionLogs(string interactionId)
        {
            var logs = await _auditLogService.GetGuidedActionLogsByInteraction(interactionId);
            return Ok(logs);
        }
    }
}
