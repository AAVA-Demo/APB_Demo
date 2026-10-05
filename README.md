APB_Demo

1. Backend: Register services by calling services.AddAppServices(configuration) in Program.cs and ensure Microsoft.EntityFrameworkCore and Microsoft.EntityFrameworkCore.InMemory are referenced.
2. Backend controllers require standard ASP.NET Core setup with [ApiController], [Authorize], and ProblemDetails exception handling (not included here).
3. Entities are mapped in Backend/Data/AppDbContext.cs; EF Core migrations or database provider configuration must be added in your host app.
4. InsightAnalysisService is a default deterministic implementation that infers root causes from DiagnosticInsight categories; replace it with a real AI/rules engine as needed.
5. Frontend: Mount DiagnosticPanelPage inside your React tree and pass memberId as a prop; ensure Bootstrap CSS is loaded globally.
6. Frontend uses fetch via Frontend/src/api/apiClient.ts and assumes a JWT token in localStorage as "authToken".
7. API base URLs in apiClient are relative; configure your hosting so frontend and backend share the same origin or add a prefix.
8. Components rely only on Bootstrap utility/structural classes; no custom CSS files are included.
9. Hooks (useDiagnosticInsights, useRemediationSteps, useRecommendations, useMemberIssueSummary, useInsights) attach directly to the API contracts defined in the LLDs.
10. The solution does not include Program.cs, project files, or React bootstrapping; integrate these files into your existing .NET and React setup.
