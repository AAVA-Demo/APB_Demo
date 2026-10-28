using System;

namespace Backend.Models
{
    public class InteractionNotFoundException : Exception
    {
        public InteractionNotFoundException(string message) : base(message)
        {
        }
    }
}
