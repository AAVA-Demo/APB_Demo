using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/members/{memberId:guid}/cases/{caseId:guid}/context")]
    [Authorize]
    public class MemberContextController : ControllerBase
    {
        private readonly IMemberContextService _service;

        public MemberContextController(IMemberContextService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(MemberContextDto), 200)]
        public async Task<IActionResult> GetMemberContext(System.Guid memberId, System.Guid caseId)
        {
            if (memberId == System.Guid.Empty || caseId == System.Guid.Empty)
            {
                return BadRequest("Invalid identifiers.");
            }

            var context = await _service.GetMemberContextAsync(memberId, caseId);
            if (context == null)
            {
                return NotFound();
            }

            return Ok(context);
        }
    }
}
