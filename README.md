APB_Demo backend uses ASP.NET Core Web API with Entity Framework Core (Microsoft.EntityFrameworkCore) and an in-memory AppDbContext.
Register services by calling ServiceRegistration.AddAppServices(services, connectionString) in Program.cs and enabling [Authorize] with your auth setup.
Controllers implemented: AiDiagnosticController, RecommendationController, AiInsightController, AgentDesktopLayoutController, GuidedActionLogController.
External AI integration is abstracted via IAiEngineClient/AiEngineClient; replace AiEngineClient with a real AI engine client as needed.
InteractionContextProvider is a simple stub; replace it with your Interaction Management System integration.
Frontend React components mount into your app via AgentDesktopShell -> InteractionWorkspace -> AiDiagnosticPanelContainer -> AiDiagnosticPanel.
Hooks and API clients: useAiDiagnosticPanel, aiDiagnosticApi, recommendationApi, aiInsightsApi, agentDesktopLayoutApi, guidedActionLogApi.
Bootstrap CSS is assumed to be globally available; ensure you import Bootstrap in your React app entry point.
No Program.cs, csproj, package.json, or index.tsx are included; create them and reference these files appropriately.
Guided actions logging uses AuditLogService and GuidedActionLogRepository over AppDbContext.
Security assumes authenticated agents; wire your authentication to authorize access to /api routes.
Layout and AI panel configuration use AgentDesktopLayoutService and AgentDesktopLayoutRepository; replace repository with configuration store as needed.
All DTOs and TypeScript interfaces follow the LLD contracts for fields and types.
Make sure to configure routing so AgentDesktopShell is rendered within the existing interaction view route.