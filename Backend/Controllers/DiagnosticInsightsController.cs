using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/diagnostic-insights")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _service;

        public DiagnosticInsightsController(IDiagnosticInsightsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(DiagnosticInsightsDto), 200)]
        public async Task<IActionResult> GetDiagnosticInsights(string caseId)
        {
            var result = await _service.GetInsightsAsync(caseId);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
