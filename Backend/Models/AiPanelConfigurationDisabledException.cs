using System;

namespace Backend.Models
{
    public class AiPanelConfigurationDisabledException : Exception
    {
        public AiPanelConfigurationDisabledException(string message) : base(message)
        {
        }
    }
}
