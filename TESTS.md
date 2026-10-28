Controllers covered: AgentDesktopLayoutController, AiDiagnosticController, AiInsightController, GuidedActionLogController, RecommendationController.
Test file paths: Backend.Tests/Controllers/AgentDesktopLayoutControllerTests.cs, Backend.Tests/Controllers/AiDiagnosticControllerTests.cs, Backend.Tests/Controllers/AiInsightControllerTests.cs, Backend.Tests/Controllers/GuidedActionLogControllerTests.cs, Backend.Tests/Controllers/RecommendationControllerTests.cs.
Required packages: xunit, Moq, Microsoft.NET.Test.Sdk, xunit.runner.visualstudio, plus a project reference to the Backend project.
Create a test project (e.g., Backend.Tests) targeting .NET 8, add the above packages, and reference the Backend project.
Run tests with: dotnet test.
Scenarios skipped: no explicit NotFound or BadRequest handling exists in the controllers, so such behaviors are not tested.
No integration tests, HTTP routing tests, or authorization attribute tests are included.
Ensure the test project does not perform any real I/O; all external dependencies are mocked with Moq.
