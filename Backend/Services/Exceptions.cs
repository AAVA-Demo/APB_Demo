using System;

namespace Backend.Services
{
    public class CaseNotFoundException : Exception
    {
        public CaseNotFoundException() : base("Case not found.") { }
    }

    public class InsightNotFoundException : Exception
    {
        public InsightNotFoundException() : base("Insight not found.") { }
    }

    public class RemediationStepsNotFoundException : Exception
    {
        public RemediationStepsNotFoundException() : base("Remediation steps not found.") { }
    }

    public class RecommendationNotFoundException : Exception
    {
        public RecommendationNotFoundException() : base("Recommendation not found.") { }
    }

    public class DuplicateOutcomeException : Exception
    {
        public DuplicateOutcomeException() : base("Outcome already exists.") { }
    }

    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message) { }
    }
}
