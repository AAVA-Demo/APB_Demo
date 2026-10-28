using System;

namespace Backend.Models
{
    public class GuidedActionLogPersistenceException : Exception
    {
        public GuidedActionLogPersistenceException(string message) : base(message)
        {
        }
    }
}
