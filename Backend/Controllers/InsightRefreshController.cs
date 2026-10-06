using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/diagnostics")]
    [Authorize]
    public class InsightRefreshController : ControllerBase
    {
        private readonly IInsightRefreshService _service;

        public InsightRefreshController(IInsightRefreshService service)
        {
            _service = service;
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestInsights(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid case identifier.",
                    Data = null
                });
            }

            try
            {
                var dto = await _service.GetLatestInsightsAsync(caseId);
                return Ok(new ApiResponseWrapper<RealTimeInsightDto>
                {
                    Status = "Success",
                    Data = dto,
                    ErrorMessage = null
                });
            }
            catch (CaseNotFoundException)
            {
                return NotFound(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Case not found.",
                    Data = null
                });
            }
            catch (InsightRefreshUnavailableException)
            {
                return StatusCode(503, new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Diagnostics temporarily unavailable.",
                    Data = null
                });
            }
        }
    }
}
