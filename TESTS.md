Controllers covered: ContextAwareRecommendationsController, DiagnosticPanelController, InsightsController, RealTimeInsightsController, RemediationStepsController, ResolutionsController.
Test files: Backend.Tests/Controllers/*ControllerTests.cs for each of the above controllers.
Packages needed: xunit, Moq, Microsoft.NET.Test.Sdk, xunit.runner.visualstudio, plus a project reference to the Backend project.
Create a test project (e.g., Backend.Tests) targeting .NET 8 and include these files in it; ensure Backend.Tests references Backend.
Run tests from the repository root with: dotnet test.
Scenarios skipped: only behaviors explicitly implemented in the controllers are tested; no authorization, routing, or global exception handling behavior is covered.
No integration tests, databases, or external services are used; all dependencies are mocked.
If additional configuration (like test runsettings) is required, add it to the test project configuration, not to these files.