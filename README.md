Backend:
- Register services via builder.Services.AddAppServices(); and configure AppDbContext with Microsoft.EntityFrameworkCore.
- HealthController exposes GET /api/health returning HealthStatusDto.
- Replace HealthService/HealthRepository if integrating with real persistence or monitoring.

Frontend:
- Use Bootstrap CSS globally (not included here).
- Mount HealthStatusPanel inside your React tree and ensure fetch base URL points to backend.
- apiClient attaches Bearer token from localStorage key "authToken" and normalizes errors.

Assumptions:
- Minimal health-check style LLD; auth pipeline and Program.cs / index.tsx are expected to be provided by host app.
