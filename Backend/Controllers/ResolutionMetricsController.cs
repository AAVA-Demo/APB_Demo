using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostic-panel/metrics/ai-assisted")]
    [Authorize]
    public class ResolutionMetricsController : ControllerBase
    {
        private readonly IResolutionMetricsService _resolutionMetricsService;
        private readonly IAuthenticationContextProvider _authenticationContextProvider;

        public ResolutionMetricsController(IResolutionMetricsService resolutionMetricsService, IAuthenticationContextProvider authenticationContextProvider)
        {
            _resolutionMetricsService = resolutionMetricsService;
            _authenticationContextProvider = authenticationContextProvider;
        }

        [HttpGet]
        public async Task<ActionResult<AiAssistedResolutionMetricsDto>> GetAiAssistedResolutionMetrics([FromQuery] string fromDate, [FromQuery] string toDate)
        {
            if (!DateTime.TryParse(fromDate, out var from))
            {
                return BadRequest("From date is required and must be valid.");
            }

            if (!DateTime.TryParse(toDate, out var to))
            {
                return BadRequest("To date is required and must be valid.");
            }

            var userId = _authenticationContextProvider.GetCurrentUserId();
            var roles = _authenticationContextProvider.GetCurrentUserRoles();
            if (string.IsNullOrWhiteSpace(userId) || roles == null || !roles.Contains("TeamLead"))
            {
                return Forbid("User is not authorized to view AI-assisted metrics.");
            }

            try
            {
                var dto = await _resolutionMetricsService.GetAiAssistedMetrics(from, to, userId);
                return Ok(dto);
            }
            catch (InvalidDateRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (MetricsNotAvailableException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
