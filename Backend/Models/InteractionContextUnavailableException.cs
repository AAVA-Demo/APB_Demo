using System;

namespace Backend.Models
{
    public class InteractionContextUnavailableException : Exception
    {
        public InteractionContextUnavailableException(string message) : base(message)
        {
        }
    }
}
