using System;

namespace Backend.Models
{
    public class AgentDesktopConfigurationNotFoundException : Exception
    {
        public AgentDesktopConfigurationNotFoundException(string message) : base(message)
        {
        }
    }
}
