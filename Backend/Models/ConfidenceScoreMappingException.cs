using System;

namespace Backend.Models
{
    public class ConfidenceScoreMappingException : Exception
    {
        public ConfidenceScoreMappingException(string message) : base(message)
        {
        }
    }
}
