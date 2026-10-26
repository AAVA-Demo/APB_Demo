using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}/insights/{insightId}/outcome")]
    [Authorize]
    public class DiagnosticOutcomeController : ControllerBase
    {
        private readonly IDiagnosticInsightOutcomeService _service;

        public DiagnosticOutcomeController(IDiagnosticInsightOutcomeService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> RecordResolutionOutcome(
            string caseId,
            string insightId,
            [FromBody] RecordResolutionOutcomeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var dto = await _service.RecordResolutionOutcome(
                    caseId,
                    insightId,
                    request.IsResolved,
                    request.Comment,
                    request.RecordedBy);
                return Ok(dto);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (CaseNotFoundException)
            {
                return NotFound();
            }
            catch (InsightNotFoundException)
            {
                return NotFound();
            }
            catch (DuplicateOutcomeException)
            {
                return Conflict();
            }
        }
    }
}
