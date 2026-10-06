using System;
using System.Linq;
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
    public class DiagnosticsController : ControllerBase
    {
        private readonly IAiDiagnosticService _aiDiagnosticService;

        public DiagnosticsController(IAiDiagnosticService aiDiagnosticService)
        {
            _aiDiagnosticService = aiDiagnosticService;
        }

        [HttpGet("real-time")]
        public async Task<IActionResult> GetRealTimeDiagnostics(string caseId)
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
                var dto = await _aiDiagnosticService.GetRealTimeDiagnosticsAsync(caseId);
                var response = new ApiResponseWrapper<DiagnosticInsightDto>
                {
                    Status = "Success",
                    Data = dto,
                    ErrorMessage = null
                };
                return Ok(response);
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
            catch (AiEngineUnavailableException)
            {
                return StatusCode(503, new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Diagnostics temporarily unavailable.",
                    Data = null
                });
            }
            catch (DiagnosticsNotAvailableException)
            {
                return StatusCode(503, new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Diagnostics not available.",
                    Data = null
                });
            }
        }
    }
}
