Backend:
- Call Backend.AddAppServices(connectionString) from Program.cs to register DbContext, services, and repositories.
- Ensure packages: Microsoft.EntityFrameworkCore, Microsoft.EntityFrameworkCore.InMemory, Microsoft.AspNetCore.Authentication.JwtBearer.
- Controllers are secured with [Authorize]; plug in your existing auth configuration.
- Default external integrations (AIInsightEngine, RemediationEngineClient, RealTimeInsightSource, CaseContextResolverService, IssueContextMapper, CaseContextMapper) are simple stubs; replace with real systems.

Frontend:
- Use a React + TypeScript app with Bootstrap included (no CSS files provided here).
- Mount DiagnosticPanel in your case page and pass caseId, memberId, issueId, and auth token props.
- All API calls go through Frontend/src/api/apiClient.ts; wire base URL and auth token as needed.
- No index.tsx or package.json are generated; create them using your existing tooling.
- Assumes caseId, issueId, memberId, and agent auth token are supplied by the host application.