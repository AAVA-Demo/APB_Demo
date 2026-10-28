using System.Collections.Generic;

namespace Backend.Dtos
{
    public class AgentDesktopLayoutConfigurationDto
    {
        public List<DesktopRegionConfigurationDto> Regions { get; set; } = new List<DesktopRegionConfigurationDto>();
    }
}
