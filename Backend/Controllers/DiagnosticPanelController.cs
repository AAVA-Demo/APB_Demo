using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/diagnostic-panel")]
    [Authorize]
    public class DiagnosticPanelController : ControllerBase
    {
        private readonly IDiagnosticInsightService _service;

        public DiagnosticPanelController(IDiagnosticInsightService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<DiagnosticPanelResponseDto> GetDiagnosticPanelData(
            [FromRoute][Required] string caseId,
            [FromQuery] string? memberId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId must not be blank");
            }

            if (memberId != null && memberId.Length > 64)
            {
                return BadRequest("memberId length must be <= 64");
            }

            var response = _service.GetPanelData(caseId, memberId);
            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
