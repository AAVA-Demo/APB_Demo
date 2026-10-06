APB_Demo backend uses ASP.NET Core Web API with EF Core InMemory. Register services by calling AddAppServices on IServiceCollection in Program.cs. Controllers are secured with [Authorize] and rely on AuthenticationContextProvider and WorkspaceContextService.

Frontend React components are in Frontend/src/components and expect Bootstrap CSS loaded globally. Mount DiagnosticPanelContainer, DiagnosticInsightsSection, RemediationGuidanceSection, ContextRecommendationsList, NextBestActionPromptBanner, and DiagnosticPanelReportingView within your existing MemberIssueView/Diagnostic Panel.

Required NuGet packages: Microsoft.AspNetCore.App, Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.InMemory. Frontend requires React, React DOM, TypeScript, and Bootstrap.

Default implementations for AIInternalDiagnosticEngine, AIRecommendationEngine, and AINextBestActionEngine are simple deterministic stubs and should be replaced with real integrations.

Program.cs, csproj, index.tsx, and package.json are not included; you must create them and wire up routing and rendering. Bootstrap CSS must be referenced separately.

Assumptions: memberIssueId is provided by the workspace; authentication token is available on window.authToken; external systems like IssueManagementSystem and MemberProfileSystem are abstracted behind repositories and services.
