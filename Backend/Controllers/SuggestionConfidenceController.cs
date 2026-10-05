using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class SuggestionConfidenceController : ControllerBase
    {
        private readonly ISuggestionConfidenceService _service;

        public SuggestionConfidenceController(ISuggestionConfidenceService service)
        {
            _service = service;
        }

        [HttpGet("members/{memberId}/suggestions-confidence")]
        public async Task<ActionResult<SuggestionConfidenceResponse>> GetSuggestionsWithConfidence(string memberId)
        {
            try
            {
                var result = await _service.GetSuggestionsWithConfidenceAsync(memberId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
