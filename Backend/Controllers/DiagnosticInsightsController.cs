using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId:guid}/diagnostic-insights")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _service;

        public DiagnosticInsightsController(IDiagnosticInsightsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<DiagnosticInsightDto>>> Get(Guid caseId)
        {
            if (caseId == Guid.Empty)
            {
                return BadRequest(Problem("Invalid caseId."));
            }

            var insights = await _service.GetDiagnosticInsightsAsync(caseId);
            if (insights.Count == 0)
            {
                return NotFound(Problem("No diagnostic insights found."));
            }

            return Ok(insights);
        }
    }
}
