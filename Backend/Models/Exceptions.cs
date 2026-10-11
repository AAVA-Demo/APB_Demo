using System;

namespace Backend.Models
{
    public class CaseNotFoundException : Exception { }
    public class TelemetryUnavailableException : Exception { }
    public class IssuePatternNotRecognizedException : Exception { }
    public class CaseContextUnavailableException : Exception { }
    public class ResolutionDataUnavailableException : Exception { }
    public class InsightDataUnavailableException : Exception { }
    public class WorkspaceNotFoundException : Exception { }
    public class DiagnosticPanelUnavailableException : Exception { }
}
