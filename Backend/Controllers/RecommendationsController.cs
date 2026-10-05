using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/recommendations")]
    [Authorize]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationsService _service;

        public RecommendationsController(IRecommendationsService service)
        {
            _service = service;
        }

        [HttpPost]
        [ProducesResponseType(typeof(IEnumerable<RecommendationDto>), 200)]
        public async Task<IActionResult> GetRecommendations(string caseId, [FromBody] RecommendationContextRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.GetRecommendationsAsync(caseId, request);
            return Ok(result);
        }
    }
}
