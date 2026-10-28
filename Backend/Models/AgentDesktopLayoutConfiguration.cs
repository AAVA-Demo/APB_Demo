using System.Collections.Generic;

namespace Backend.Models
{
    public class AgentDesktopLayoutConfiguration
    {
        public List<DesktopRegionConfiguration> Regions { get; set; } = new List<DesktopRegionConfiguration>();
    }
}
