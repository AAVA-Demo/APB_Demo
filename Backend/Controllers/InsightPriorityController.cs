using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}/insights")]
    [Authorize]
    public class InsightPriorityController : ControllerBase
    {
        private readonly IInsightPriorityService _service;

        public InsightPriorityController(IInsightPriorityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<InsightListDto>> GetPrioritizedInsights(string caseId)
        {
            try
            {
                var dto = await _service.GetPrioritizedInsights(caseId);
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
        }
    }
}
