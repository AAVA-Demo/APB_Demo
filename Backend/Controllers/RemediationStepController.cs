using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}/insights/{insightId}/remediation-steps")]
    [Authorize]
    public class RemediationStepController : ControllerBase
    {
        private readonly IRemediationStepService _service;

        public RemediationStepController(IRemediationStepService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<RemediationStepsDto>> GetRemediationSteps(string caseId, string insightId)
        {
            try
            {
                var dto = await _service.GetRemediationSteps(caseId, insightId);
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
            catch (RemediationStepsNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
