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
    [Route("api/issues/{issueId:guid}/insights")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _service;
        private readonly IRealTimeUpdatePublisher _publisher;

        public DiagnosticInsightsController(IDiagnosticInsightsService service, IRealTimeUpdatePublisher publisher)
        {
            _service = service;
            _publisher = publisher;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<InsightDto>), 200)]
        public async Task<IActionResult> GetInsights(Guid issueId)
        {
            if (issueId == Guid.Empty)
            {
                return BadRequest("Invalid issueId.");
            }

            var insights = await _service.GetInsightsAsync(issueId);
            if (!insights.Any())
            {
                return NotFound();
            }

            return Ok(insights);
        }

        [HttpGet("stream")]
        [ProducesResponseType(typeof(RealTimeConnectionDto), 200)]
        public IActionResult GetInsightStream(Guid issueId)
        {
            if (issueId == Guid.Empty)
            {
                return BadRequest("Invalid issueId.");
            }

            var connection = _publisher.NegotiateConnection(issueId);
            if (connection == null)
            {
                return NotFound();
            }

            return Ok(connection);
        }

        [HttpPost("refresh")]
        [ProducesResponseType(202)]
        public async Task<IActionResult> RefreshInsights(Guid issueId, [FromBody] InsightRefreshRequestDto request)
        {
            if (issueId == Guid.Empty || request == null || request.IssueId == Guid.Empty || request.IssueId != issueId)
            {
                return BadRequest("Invalid request.");
            }

            var exists = await _service.TriggerRefreshAsync(issueId, request.TriggerSource);
            if (!exists)
            {
                return NotFound();
            }

            return StatusCode(202);
        }
    }
}
