using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId:guid}/summary")]
    [Authorize]
    public class CaseSummaryController : ControllerBase
    {
        private readonly ICaseSummaryService _service;

        public CaseSummaryController(ICaseSummaryService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CaseSummaryDto>> Get(Guid caseId)
        {
            if (caseId == Guid.Empty)
            {
                return BadRequest(Problem("Invalid caseId."));
            }

            var summary = await _service.GetCaseSummaryAsync(caseId);
            if (summary == null)
            {
                return NotFound(Problem("Case summary not found."));
            }

            return Ok(summary);
        }
    }
}
