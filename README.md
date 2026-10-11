Backend:
1. Register services in Program.cs: builder.Services.AddAppServices("unused-connection-string"); and enable authentication/authorization.
2. Use ASP.NET Core 8 Web API with packages: Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.InMemory, Microsoft.AspNetCore.Authentication.JwtBearer.
3. Replace default AI-related implementations if needed: IssuePatternService, RecommendationRepository, TelemetryStreamService, ResolutionRepository, InsightRepository.

Frontend:
4. React 18 app with TypeScript; install axios and bootstrap, and import bootstrap CSS in your entry file.
5. Use WorkspaceLayout as the top-level workspace component, passing workspaceId and caseId from your router.
6. DiagnosticPanelDrawer, RealTimeInsightsSection, RemediationStepsSection, ContextAwareRecommendationsSection, ResolutionSuggestionsSection, InsightList, RemediationList, and other components are mounted within CaseViewPanel.

Notes:
7. This repo omits project/solution files, index.tsx, and backend Program.cs; create them and wire up routing and authentication.
8. AppDbContext uses an in-memory database by default; replace with a real provider and migrations for production.
9. All APIs assume a Bearer token is provided; apiClient.ts attaches the token from localStorage.authToken.