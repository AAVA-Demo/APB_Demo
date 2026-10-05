using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId:guid}/recommended-actions")]
    [Authorize]
    public class RecommendedActionsController : ControllerBase
    {
        private readonly IRecommendedActionsService _service;

        public RecommendedActionsController(IRecommendedActionsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<RecommendedActionDto>>> Get(Guid issueId)
        {
            if (issueId == Guid.Empty)
            {
                return BadRequest(Problem("Invalid issueId."));
            }

            var actions = await _service.GetRecommendedActionsAsync(issueId);
            if (actions.Count == 0)
            {
                return NotFound(Problem("No recommended actions found."));
            }

            return Ok(actions);
        }
    }
}
