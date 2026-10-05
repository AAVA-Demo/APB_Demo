using System;
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
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;

        public DiagnosticInsightsController(IDiagnosticInsightsService diagnosticInsightsService)
        {
            _diagnosticInsightsService = diagnosticInsightsService;
        }

        [HttpGet]
        public async Task<ActionResult<DiagnosticInsightsResponseDto>> GetDiagnosticInsights(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId is required");
            }

            var result = await _diagnosticInsightsService.GetDiagnosticInsightsAsync(caseId);
            if (result == null)
            {
                return NotFound("Case not found");
            }

            return Ok(result);
        }
    }
}
