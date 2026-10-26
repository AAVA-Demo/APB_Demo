Controllers tested: DiagnosticInsightController, DiagnosticOutcomeController, InsightPriorityController, InsightRefreshController, RecommendationExplanationController, RemediationStepController.
Test files: Backend.Tests/Controllers/DiagnosticInsightControllerTests.cs; Backend.Tests/Controllers/DiagnosticOutcomeControllerTests.cs; Backend.Tests/Controllers/InsightPriorityControllerTests.cs; Backend.Tests/Controllers/InsightRefreshControllerTests.cs; Backend.Tests/Controllers/RecommendationExplanationControllerTests.cs; Backend.Tests/Controllers/RemediationStepControllerTests.cs.
Required packages: xunit, Moq, Microsoft.NET.Test.Sdk, xunit.runner.visualstudio, plus a project reference to the Backend project.
Configure a test project (e.g., Backend.Tests) targeting .NET 8 and referencing the Backend project; ensure the test framework and Moq are referenced.
Run tests from the repository root with: dotnet test.
Exception-only or authorization behavior is not tested beyond what the controllers explicitly handle (e.g., ValidationException, not found, and duplicate outcome paths).
No integration tests, database, or network I/O are used; all services are mocked.
Additional configuration such as test project .csproj and dependency injection setup must be provided separately in the solution.
