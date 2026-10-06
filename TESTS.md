Controllers covered: ContextAwareIssueController, DiagnosticInsightsController, InsightConfidenceController, RealTimeDiagnosticInsightsController, RemediationInstructionsController, RemediationWorkflowController.
Test files: Backend.Tests/Controllers/ContextAwareIssueControllerTests.cs, Backend.Tests/Controllers/DiagnosticInsightsControllerTests.cs, Backend.Tests/Controllers/InsightConfidenceControllerTests.cs, Backend.Tests/Controllers/RealTimeDiagnosticInsightsControllerTests.cs, Backend.Tests/Controllers/RemediationInstructionsControllerTests.cs, Backend.Tests/Controllers/RemediationWorkflowControllerTests.cs.
Required packages: xunit, Moq, Microsoft.NET.Test.Sdk, xunit.runner.visualstudio, plus a project reference to the Backend project so controllers, DTOs, and services are available.
Create a test project (e.g., Backend.Tests) targeting .NET 8, reference the Backend project, and include the test files under Backend.Tests/Controllers.
Running tests: from the repo root, navigate to the Backend.Tests project folder and run: dotnet test.
All tests are unit tests using mocked services only; no database, network, or other external I/O is performed.
Skipped scenarios: controllers do not implement explicit not-found or exception handling, so 404 and 500 paths are not tested.
Async controller actions are tested with async Task or async streams where applicable.
No tests are generated for services, repositories, models, DTOs, or frontend code, per scope.
