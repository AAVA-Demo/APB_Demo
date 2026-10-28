using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IAgentDesktopLayoutService
    {
        Task<AgentDesktopLayoutConfigurationDto> GetLayoutConfiguration();
        Task<AiDiagnosticPanelConfigurationDto> GetAiDiagnosticPanelConfiguration();
    }
}
