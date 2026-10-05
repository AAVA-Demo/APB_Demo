APB_Demo backend is an ASP.NET Core Web API (.NET 8) with EF Core and a layered architecture (Controllers, Services, Repositories, Models, Dtos, Data).
Register services by calling ServiceRegistration.AddAppServices(services, connectionString) from Program.cs and configure authentication/[Authorize] as needed.
AppDbContext uses an in-memory database by default; switch to a real provider (Microsoft.EntityFrameworkCore.SqlServer or others) in ServiceRegistration.
Default implementations to replace in production: AIInsightsGenerator, RemediationEngine, RootCauseEngine, MemberHistoryClient, and the in-memory SupportCase/Member stores.
All backend endpoints are under /api/support and match the LLD contracts for insights, remediation, root-cause recommendations, context-aware insights, SSE stream, and case metrics.
Frontend is React with TypeScript; mount DiagnosticPanelPage (passing caseId and memberId props) into your router at routes like /support/cases/:caseId/diagnostic.
Components rely on Bootstrap utility classes; ensure bootstrap CSS is loaded in your host app (e.g., via CDN import).
Frontend HTTP calls use fetch via Frontend/src/api/apiClient.ts with a stub getAuthToken; wire this to your auth token provider.
Program.cs, csproj, index.tsx, and package.json are not included; create them and reference Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.InMemory, Microsoft.AspNetCore.Authentication, React, and TypeScript.
Security and authorization are minimal; controllers are marked [Authorize] but no policies are configured.
SSE support for /insights/stream uses EventSource on the frontend and a simple text/event-stream implementation on the backend.
Assumptions from the LLDs: case/member existence is validated, agents are authenticated, and AI engines are synchronous but simulated with deterministic logic here.
