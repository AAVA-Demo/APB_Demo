using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}/insights/diagnostic")]
    [Authorize]
    public class DiagnosticInsightController : ControllerBase
    {
        private readonly IDiagnosticInsightService _service;

        public DiagnosticInsightController(IDiagnosticInsightService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<DiagnosticInsightListDto>> GetDiagnosticInsights(string caseId)
        {
            try
            {
                var result = await _service.GetDiagnosticInsights(caseId);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (CaseNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
