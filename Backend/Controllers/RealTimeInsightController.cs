using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/real-time-insights")]
    [Authorize]
    public class RealTimeInsightController : ControllerBase
    {
        private readonly IRealTimeInsightService _service;

        public RealTimeInsightController(IRealTimeInsightService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<RealTimeInsightsResponseDto> GetRealTimeInsights([FromRoute][Required] string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId must not be blank");
            }

            var response = _service.GetRealTimeInsights(caseId);
            if (response == null || response.Insights.Count == 0)
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
