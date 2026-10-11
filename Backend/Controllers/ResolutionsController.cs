using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/resolutions")]
    [Authorize]
    public class ResolutionsController : ControllerBase
    {
        private readonly IResolutionSuggestionService _resolutionSuggestionService;

        public ResolutionsController(IResolutionSuggestionService resolutionSuggestionService)
        {
            _resolutionSuggestionService = resolutionSuggestionService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CaseResolutionsDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetPrioritizedResolutions(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId is required.");
            }

            try
            {
                var result = await _resolutionSuggestionService.GetPrioritizedResolutionsAsync(caseId);
                return Ok(result);
            }
            catch (CaseNotFoundException)
            {
                return NotFound("No resolution suggestions available for this case.");
            }
            catch (ResolutionDataUnavailableException)
            {
                return StatusCode(503, "Resolution suggestions are temporarily unavailable.");
            }
        }
    }
}
