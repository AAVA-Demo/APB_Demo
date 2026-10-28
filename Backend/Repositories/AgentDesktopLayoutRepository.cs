using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class AgentDesktopLayoutRepository : IAgentDesktopLayoutRepository
    {
        public Task<AgentDesktopLayoutConfigurationDto> GetLayout()
        {
            var layout = new AgentDesktopLayoutConfigurationDto
            {
                Regions = new System.Collections.Generic.List<DesktopRegionConfigurationDto>
                {
                    new DesktopRegionConfigurationDto
                    {
                        RegionId = "right-sidebar",
                        Name = "Right Sidebar",
                        SupportsAiPanel = true
                    }
                }
            };
            return Task.FromResult(layout);
        }

        public Task<AiDiagnosticPanelConfigurationDto> GetAiPanelConfiguration()
        {
            var config = new AiDiagnosticPanelConfigurationDto
            {
                IsEnabled = true,
                DefaultRegionId = "right-sidebar",
                PanelTitle = "AI Diagnostic Panel"
            };
            return Task.FromResult(config);
        }
    }
}
