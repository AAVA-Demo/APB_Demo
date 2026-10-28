using System;

namespace Backend.Models
{
    public class AiInsightsUnavailableException : Exception
    {
        public AiInsightsUnavailableException(string message) : base(message)
        {
        }
    }
}
