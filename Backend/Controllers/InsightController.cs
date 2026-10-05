using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/insights")]
    [Authorize]
    public class InsightController : ControllerBase
    {
        private readonly IInsightIndicatorEnrichmentService _service;

        public InsightController(IInsightIndicatorEnrichmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<InsightIndicatorDto>> GetInsights([FromRoute][Required] string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId must not be blank");
            }

            var insights = _service.GetInsightsWithIndicators(caseId);
            if (insights == null || insights.Count == 0)
            {
                return NotFound();
            }

            return Ok(insights);
        }
    }
}
