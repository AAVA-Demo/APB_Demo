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
    [Route("api/issues/{issueId:guid}/recommendations")]
    [Authorize]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationsService _service;

        public RecommendationsController(IRecommendationsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<RecommendationDto>>> Get(Guid issueId)
        {
            if (issueId == Guid.Empty)
            {
                return BadRequest(Problem("Invalid issueId."));
            }

            var list = await _service.GetRecommendationsAsync(issueId);
            if (list.Count == 0)
            {
                return NotFound(Problem("No recommendations found."));
            }

            return Ok(list);
        }
    }
}
