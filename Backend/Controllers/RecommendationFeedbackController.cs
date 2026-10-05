using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/recommendations/{recommendationId}/feedback")]
    [Authorize]
    public class RecommendationFeedbackController : ControllerBase
    {
        private readonly IRecommendationFeedbackService _service;

        public RecommendationFeedbackController(IRecommendationFeedbackService service)
        {
            _service = service;
        }

        [HttpPost]
        public ActionResult<RecommendationFeedbackResponseDto> SubmitFeedback(
            [FromRoute][Required] string recommendationId,
            [FromBody] RecommendationFeedbackRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(recommendationId))
            {
                return BadRequest("recommendationId must not be blank");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = _service.SubmitFeedback(recommendationId, request);
            return Ok(response);
        }
    }
}
