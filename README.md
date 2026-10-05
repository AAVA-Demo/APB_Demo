APB_Demo backend is an ASP.NET Core Web API (.NET 8) and the frontend is React with TypeScript.

Backend setup:
- Register services in Program.cs via builder.Services.AddAppServices() and configure AppDbContext with Microsoft.EntityFrameworkCore and Microsoft.EntityFrameworkCore.InMemory or SQL provider.
- Secure endpoints with ASP.NET Core authentication/authorization; controllers already use [Authorize] on /api/** and [AllowAnonymous] on /internal/**.
- Default external system implementations: AiDiagnosticClient, AiRemediationClient, InteractionHistoryClient, AiRecommendationClient, AiInsightClient, AiAgentInsightClient, InsightUpdateNotifier. Replace these with real HTTP/REST or messaging integrations as needed.

Frontend setup:
- Create a React app with TypeScript and ensure Bootstrap CSS is loaded in the host app (no CSS files are included here).
- Mount components like DiagnosticInsightsPanel, RemediationStepsPanel, IssueContextPanel, RecommendationPanel, DiagnosticPanelRealtimeView, and DiagnosticPanelAgentView within your routing or page layout.
- Ensure the dev server proxies /api/** requests to the ASP.NET Core backend or host the static assets from the same origin.

Packages required:
- Backend: Microsoft.AspNetCore.Authentication, Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.* provider.
- Frontend: React 18, TypeScript, @types/react, and Bootstrap CSS included via CDN or npm.

Assumptions:
- Interaction, Case, and member identifiers are supplied by the hosting application.
- Real-time insight streaming uses Server-Sent Events; consumers must use an EventSource-capable browser.
- No solution (.sln), csproj, or package.json files are included; create them in your environment and wire up these sources accordingly.