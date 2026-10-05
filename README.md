APB_Demo - Diagnostic Panel Backend/Frontend Skeleton

Backend: Use ServiceRegistration.AddAppServices in Program.cs to register AppDbContext (currently InMemory), repositories, services, and RealTimeUpdatePublisher. Ensure packages like Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.InMemory, and Microsoft.AspNetCore.Authentication.JwtBearer are referenced.

Controllers implemented: DiagnosticInsightsController, RemediationController, MemberContextController, RemediationWorkflowController. All use [ApiController] and [Authorize]; global exception handling with ProblemDetails should be configured in Program.cs.

RealTimeUpdatePublisher is a minimal, deterministic stub that returns a fixed WebSocket URL and no-op publish; replace this with your SignalR or messaging implementation.

Frontend: Components include DiagnosticPanelPage, DiagnosticInsightsList, ConfidenceBadge, RemediationStepsPanel, RemediationStepItem, MemberIssueOverviewPanel, ActivityTimeline, HistorySummary, GuidedWorkflowPanel, WorkflowStepItem. Mount these in your React app (e.g., in a router or parent panel) and pass issueId, memberId, caseId, or insightId props as needed.

Hooks implemented: useDiagnosticInsights, useRemediationSteps, useMemberIssueContext, useGuidedWorkflow. API clients use a shared apiClient based on fetch; ensure a global authToken (e.g., window.authToken) is set and Bootstrap CSS is loaded.

Assumptions from LLDs: insights and remediation steps are pre-generated upstream; context data resides in a single database; only one active workflow per issue; real-time updates share existing SignalR infrastructure. Replace the in-memory database and stubbed real-time publisher, and add app bootstrap files (Program.cs, React entrypoint) as needed.
