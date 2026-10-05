using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/members/{memberId:guid}/issue-summary")]
    [Authorize]
    public class MemberIssueSummaryController : ControllerBase
    {
        private readonly IMemberIssueSummaryService _service;

        public MemberIssueSummaryController(IMemberIssueSummaryService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(MemberIssueSummaryDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<MemberIssueSummaryDto>> GetIssueSummary(Guid memberId)
        {
            if (memberId == Guid.Empty)
            {
                return BadRequest();
            }

            var summary = await _service.GetMemberIssueSummaryAsync(memberId);
            if (summary == null)
            {
                return NotFound();
            }

            return Ok(summary);
        }
    }
}
