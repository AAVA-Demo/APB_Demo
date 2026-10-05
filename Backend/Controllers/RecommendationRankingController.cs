using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/recommendations")]
    [Authorize]
    public class RecommendationRankingController : ControllerBase
    {
        private readonly IRecommendationRankingService _service;

        public RecommendationRankingController(IRecommendationRankingService service)
        {
            _service = service;
        }

        [HttpGet("{interactionId}")]
        public async Task<ActionResult<RankedRecommendationResponseDto>> GetRankedRecommendations(string interactionId)
        {
            try
            {
                var result = await _service.GetRankedRecommendationsAsync(interactionId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("/internal/recommendations/rank")]
        [AllowAnonymous]
        public async Task<ActionResult<RankedRecommendationResponseDto>> RankRecommendations([FromBody] RecommendationRankRequestDto request)
        {
            try
            {
                var result = await _service.RankRecommendationsAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
