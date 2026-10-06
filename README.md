APB_Demo backend uses ASP.NET Core 8 and Entity Framework Core with AppDbContext in Backend/Data/AppDbContext.cs.
Register services by calling ServiceRegistration.AddAppServices(services) from your Program.cs during startup.
Controllers are under Backend/Controllers and follow the routes defined in the LLD API Contracts.
Frontend React components (TypeScript) live in Frontend/src/components and hooks in Frontend/src/hooks.
Mount DiagnosticPanelPage on routes like /cases/:caseId/diagnostic-panel using React Router.
API clients use Frontend/src/api/apiClient.ts which adds auth token (stub) and normalizes errors.
Required NuGet packages include Microsoft.AspNetCore.Authentication.JwtBearer and Microsoft.EntityFrameworkCore.InMemory.
Default external implementations (RealTimeInsightsEngineClient, IssueDetectionEngineClient, RemediationEngineClient, ConfidenceCalculationPolicyProvider, MemberEventStreamClient, InsightsRefreshSchedulerService) are simple and should be replaced.
Bootstrap CSS/JS must be added in your HTML shell; no CSS files are generated here.
Program.cs, Startup, and index.tsx are not included and must be created to wire controllers, routing, and components.
Security assumptions: JWT-authenticated support agents; controller [Authorize] attributes are present but full auth pipeline is not configured.
Streaming endpoints use IAsyncEnumerable on backend and EventSource on frontend as minimal SSE implementations.
MemberContextSummaryPanel currently uses a stub hook; replace with a backend summary endpoint when available.
Real-time, remediation, context-aware, confidence, and diagnostic flows all share the single APB_Demo codebase.
