Backend:
- Call AddAppServices(connectionString) from Program.cs to register DbContext, repositories, services, InsightEventListener and DefaultInsightEngine.
- Ensure Microsoft.EntityFrameworkCore and Microsoft.EntityFrameworkCore.SqlServer packages are referenced.
- Add authentication and [Authorize] setup in Program.cs; controllers assume authenticated support agents.
- InsightRefreshHub and InsightEventListener provide default no-op implementations and can be replaced with real SignalR and event-stream integrations.

Frontend:
- React components under Frontend/src/components use Bootstrap utility classes; include Bootstrap CSS in your host app.
- Mount DiagnosticInsightsPanel, RemediationStepsPanel, RealTimeInsightsPanel, InsightListPanel, RecommendationDetailsPanel, and ResolutionOutcomePanel within your existing case diagnostics route and pass caseId/insightId/recommendationId props.
- apiClient.ts uses window.fetch; configure getAuthToken to return an auth token if required.

Assumptions:
- No project/solution, index.tsx, or routing bootstrap is provided; integrate these files into your existing build.
- External AI/insight engines are abstracted behind IInsightEngine with DefaultInsightEngine as a simple deterministic implementation.
