using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostic-insights")]
    [Authorize]
    public class DiagnosticInsightController : ControllerBase
    {
        private readonly IDiagnosticInsightService _service;

        public DiagnosticInsightController(IDiagnosticInsightService service)
        {
            _service = service;
        }

        [HttpGet("{interactionId}")]
        public async Task<ActionResult<DiagnosticInsightResponseDto>> GetDiagnosticInsights(string interactionId)
        {
            try
            {
                var result = await _service.GetDiagnosticInsightsAsync(interactionId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("/internal/diagnostic-insights/process")]
        [AllowAnonymous]
        public async Task<ActionResult<DiagnosticInsightResponseDto>> ProcessDiagnosticInsights([FromBody] DiagnosticInsightProcessRequestDto request)
        {
            try
            {
                var result = await _service.ProcessDiagnosticInsightsAsync(request.InteractionId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
