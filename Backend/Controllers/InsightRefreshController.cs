using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics/cases/{caseId}/insights/current")]
    [Authorize]
    public class InsightRefreshController : ControllerBase
    {
        private readonly IInsightRefreshService _service;

        public InsightRefreshController(IInsightRefreshService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<CurrentInsightsDto>> GetCurrentInsights(string caseId)
        {
            try
            {
                var dto = await _service.GetCurrentInsights(caseId);
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
