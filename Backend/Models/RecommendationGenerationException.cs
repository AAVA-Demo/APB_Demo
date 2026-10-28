using System;

namespace Backend.Models
{
    public class RecommendationGenerationException : Exception
    {
        public RecommendationGenerationException(string message) : base(message)
        {
        }
    }
}
