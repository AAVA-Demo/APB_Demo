using System;

namespace Backend.Models
{
    public class DiagnosticInsightsNotAvailableException : Exception
    {
        public DiagnosticInsightsNotAvailableException(string message) : base(message) { }
    }

    public class MemberIssueNotFoundException : Exception
    {
        public MemberIssueNotFoundException(string message) : base(message) { }
    }

    public class RemediationGuidanceNotAvailableException : Exception
    {
        public RemediationGuidanceNotAvailableException(string message) : base(message) { }
    }

    public class RecommendationsNotAvailableException : Exception
    {
        public RecommendationsNotAvailableException(string message) : base(message) { }
    }

    public class InvalidDateRangeException : Exception
    {
        public InvalidDateRangeException(string message) : base(message) { }
    }

    public class MetricsNotAvailableException : Exception
    {
        public MetricsNotAvailableException(string message) : base(message) { }
    }

    public class RecommendationNotAvailableException : Exception
    {
        public RecommendationNotAvailableException(string message) : base(message) { }
    }

    public class PanelUnavailableException : Exception
    {
        public PanelUnavailableException(string message) : base(message) { }
    }

    public class DiagnosticInsightsServiceValidationException : Exception
    {
        public DiagnosticInsightsServiceValidationException(string message) : base(message) { }
    }

    public class RemediationGuidanceServiceValidationException : Exception
    {
        public RemediationGuidanceServiceValidationException(string message) : base(message) { }
    }

    public class ContextAwareRecommendationServiceValidationException : Exception
    {
        public ContextAwareRecommendationServiceValidationException(string message) : base(message) { }
    }

    public class NextBestActionServiceValidationException : Exception
    {
        public NextBestActionServiceValidationException(string message) : base(message) { }
    }

    public class DiagnosticPanelServiceValidationException : Exception
    {
        public DiagnosticPanelServiceValidationException(string message) : base(message) { }
    }
}
