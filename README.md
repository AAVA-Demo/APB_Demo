APB_Demo backend uses ASP.NET Core Web API with DbContext AppDbContext and layered services; register via ServiceRegistration.AddAppServices in Program.cs before building the app.
Controllers expose endpoints under /api/cases/... for diagnostics, remediation, recommendations, issues, and remediation step tracking, all secured with [Authorize].
Backend requires Microsoft.EntityFrameworkCore and Microsoft.EntityFrameworkCore.InMemory packages; replace AiEngineClient with a real AI engine integration as needed.
Frontend React components mount DiagnosticPanelPage at route /cases/:caseId/diagnostics using React Router; Bootstrap CSS must be included by the host app for styling.
Custom hooks (useDiagnosticInsights, useRemediationGuidance, useContextAwareRecommendations, useRealTimeInsights, useCaseIssuesWithSeverity, useRemediationStepTracking) encapsulate API calls via axios-based apiClient.
API client modules under Frontend/src/api call all defined endpoints and expect ApiResponseWrapper<T> JSON with data and error fields.
Program.cs, index.tsx, routing setup, and actual JWT authentication middleware are assumed existing and must be wired separately.
Default AI engine client and in-memory database are placeholders intended to be replaced with production implementations and real data stores.
Assumptions: caseId and issueId are strings from route params; agent identifier for step completion is provided as a simple string (e.g., "agent-1").
All components render loading spinners, inline error alerts, and empty states using Bootstrap utility classes only.
