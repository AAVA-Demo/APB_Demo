using System;

namespace Backend.Models
{
    public class CaseNotFoundException : Exception { }
    public class AiEngineUnavailableException : Exception { }
    public class DiagnosticsNotAvailableException : Exception { }
    public class IssueNotFoundException : Exception { }
    public class RemediationGuidanceUnavailableException : Exception { }
    public class RecommendationUnavailableException : Exception { }
    public class InsightRefreshUnavailableException : Exception { }
    public class IssuesNotFoundException : Exception { }
    public class StepNotFoundException : Exception { }
}
