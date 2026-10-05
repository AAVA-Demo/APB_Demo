using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/members/{memberId:guid}/diagnostic-insights")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _service;

        public DiagnosticInsightsController(IDiagnosticInsightsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DiagnosticInsightDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<DiagnosticInsightDto>>> GetDiagnosticInsights(Guid memberId)
        {
            if (memberId == Guid.Empty)
            {
                return BadRequest();
            }

            var insights = await _service.GetDiagnosticInsightsAsync(memberId);
            if (!insights.Any())
            {
                return NotFound();
            }

            return Ok(insights);
        }
    }
}
