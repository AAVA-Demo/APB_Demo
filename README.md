APB_Demo minimal backend/frontend skeleton.

Backend: call AddAppServices(connectionString) in Program.cs to register DbContext, repositories, and services (uses InMemoryDatabase by default).
Controllers follow ASP.NET Core conventions with [ApiController] and [Authorize]; ensure authentication and global exception handling are configured.
Required backend packages: Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.InMemory, Microsoft.AspNetCore.Authentication.JwtBearer.
Frontend: mount React components (DiagnosticInsightsPanel, RemediationStepsPanel, RecommendationsPanel, IssueListPanel, GuidedWorkflowPanel, ResolutionOutcomePanel) inside your existing app shell.
Bootstrap CSS/JS must be referenced by the host app (no CSS files are generated here).
API clients use fetch via apiClient.ts; add real base URLs and auth token handling as needed.
External systems (telemetry store, AI engines, rules engines) are abstracted via TelemetryRepository, RecommendationsRepository, WorkflowRepository, and ResolutionOutcomeService; replace their default deterministic implementations.
Assumes caseId, issueId, memberId, and agentId are provided by the host diagnostic panel and passed as props to components.
