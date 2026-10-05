using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/members/{memberId:guid}/insights")]
    [Authorize]
    public class InsightsController : ControllerBase
    {
        private readonly IInsightsService _service;

        public InsightsController(IInsightsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<MemberInsightDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<MemberInsightDto>>> GetInsights(Guid memberId)
        {
            if (memberId == Guid.Empty)
            {
                return BadRequest();
            }

            var insights = await _service.GetInsightsAsync(memberId);
            if (!insights.Any())
            {
                return NotFound();
            }

            return Ok(insights);
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(IEnumerable<MemberInsightDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<MemberInsightDto>>> RefreshInsights(Guid memberId, [FromBody] RefreshInsightsRequest? request)
        {
            if (memberId == Guid.Empty)
            {
                return BadRequest();
            }

            var refreshed = await _service.RefreshInsightsAsync(memberId, request);
            if (!refreshed.Any())
            {
                return NotFound();
            }

            return Ok(refreshed);
        }
    }
}
