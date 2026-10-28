using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class AgentDesktopLayoutService : IAgentDesktopLayoutService
    {
        private readonly IAgentDesktopLayoutRepository _layoutRepository;

        public AgentDesktopLayoutService(IAgentDesktopLayoutRepository layoutRepository)
        {
            _layoutRepository = layoutRepository;
        }

        public async Task<AgentDesktopLayoutConfigurationDto> GetLayoutConfiguration()
        {
            var layout = await _layoutRepository.GetLayout();
            if (layout.Regions == null || !layout.Regions.Any())
            {
                throw new AgentDesktopConfigurationNotFoundException("No desktop regions configured.");
            }

            return layout;
        }

        public async Task<AiDiagnosticPanelConfigurationDto> GetAiDiagnosticPanelConfiguration()
        {
            var config = await _layoutRepository.GetAiPanelConfiguration();
            if (!config.IsEnabled)
            {
                throw new AiPanelConfigurationDisabledException("AI diagnostic panel is disabled.");
            }

            return config;
        }
    }
}
