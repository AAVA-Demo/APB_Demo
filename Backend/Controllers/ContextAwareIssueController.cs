using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/context-aware/cases/{caseId}")]
    [Authorize]
    public class ContextAwareIssueController : ControllerBase
    {
        private readonly IContextAwareIssueService _service;

        public ContextAwareIssueController(IContextAwareIssueService service)
        {
            _service = service;
        }

        [HttpPost("analyze")]
        public async Task<ActionResult<ContextAwareIssueAnalysisResponseDto>> AnalyzeMemberCaseWithContext(string caseId, [FromBody] AnalyzeCaseRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(caseId) || caseId != request.CaseId)
            {
                return BadRequest("CaseId is required and must reference an existing member case.");
            }

            var result = await _service.AnalyzeCase(caseId);
            return Ok(result);
        }

        [HttpGet("issues")]
        public async Task<ActionResult<ContextAwareIssuesResponseDto>> GetContextAwareIssuesForCase(string caseId)
        {
            var result = await _service.GetIssues(caseId);
            return Ok(result);
        }
    }
}
