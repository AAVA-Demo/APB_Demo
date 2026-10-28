using System;

namespace Backend.Models
{
    public class GuidedActionLogValidationException : Exception
    {
        public GuidedActionLogValidationException(string message) : base(message)
        {
        }
    }
}
