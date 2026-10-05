APB_Demo - AI-assisted Diagnostics and Guided Resolution

Backend:
- Register services by calling Backend.ServiceRegistration.AddAppServices(services, connectionString) in Program.cs and configure JWT auth and controllers.
- Backend uses Microsoft.EntityFrameworkCore and Microsoft.EntityFrameworkCore.InMemory; add these package references.
- Default AI integrations are stubbed via simple repository implementations (DiagnosticInsightsRepository, RemediationStepsRepository, CaseSummaryRepository, RecommendedActionsRepository, RecommendationsRepository) and should be replaced with real AI/analytics providers.

Frontend:
- React components are under Frontend/src/components and hooks under Frontend/src/hooks; mount panels (DiagnosticInsightsPanel, CaseSummaryPanel, RemediationStepsList, RecommendedActionsList, RecommendationsList, GuidedResolutionPage) inside existing pages (CaseDetailsPage, DiagnosticPanel) by passing caseId or issueId props.
- apiClient in Frontend/src/api/apiClient.ts uses fetch and reads an authToken from localStorage for Authorization; ensure Bootstrap CSS is included in the app shell.

Assumptions:
- Program.cs, ASP.NET Core startup, and React entry files (index.tsx) are provided elsewhere.
- All endpoints are secured for authenticated support agents and return ProblemDetails JSON on errors, surfaced in the UI as inline alerts without blocking other content.
