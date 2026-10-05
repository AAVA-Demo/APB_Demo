Controllers tested: AgentInsightLanguageController, DiagnosticInsightController, InsightRefreshController, IssueContextSummaryController, RecommendationRankingController, RemediationGuidanceController.
Test files: Backend.Tests/Controllers/*ControllerTests.cs for each controller listed above.
Packages needed: xunit, Moq, Microsoft.NET.Test.Sdk, xunit.runner.visualstudio, plus a project reference to the Backend project.
Create a test project (e.g., Backend.Tests) targeting .NET 8 and reference the Backend project and required packages.
Place the generated test files under Backend.Tests/Controllers in the test project.
Run tests from the solution root with: dotnet test.
Scenarios skipped: no explicit not-found or generic exception-handling paths are implemented in the controllers, so such cases are not tested.
No integration tests or external I/O are configured; all dependencies are mocked using Moq.
