using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public interface IAuditLogService
    {
        Task<LogGuidedActionExecutionResponseDto> CreateGuidedActionLog(LogGuidedActionExecutionRequestDto request);
        Task<List<GuidedActionExecutionLog>> GetGuidedActionLogsByInteraction(string interactionId);
    }
}
