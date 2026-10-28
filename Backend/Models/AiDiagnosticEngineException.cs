using System;

namespace Backend.Models
{
    public class AiDiagnosticEngineException : Exception
    {
        public AiDiagnosticEngineException(string message) : base(message)
        {
        }
    }
}
