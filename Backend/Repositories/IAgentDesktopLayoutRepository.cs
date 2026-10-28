using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IAgentDesktopLayoutRepository
    {
        Task<AgentDesktopLayoutConfigurationDto> GetLayout();
        Task<AiDiagnosticPanelConfigurationDto> GetAiPanelConfiguration();
    }
}
