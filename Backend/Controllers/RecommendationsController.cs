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
    [Route("api/members/{memberId:guid}/recommendations")]
    [Authorize]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationsService _service;

        public RecommendationsController(IRecommendationsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RecommendationDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetRecommendations(Guid memberId)
        {
            if (memberId == Guid.Empty)
            {
                return BadRequest();
            }

            var recommendations = await _service.GetRecommendationsAsync(memberId);
            if (!recommendations.Any())
            {
                return NotFound();
            }

            return Ok(recommendations);
        }
    }
}
