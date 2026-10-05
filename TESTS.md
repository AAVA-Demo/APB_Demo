Controllers tested: HealthController in Backend/Controllers.
Test files: Backend.Tests/Controllers/HealthControllerTests.cs.
Required packages: xunit, Moq, Microsoft.NET.Test.Sdk, xunit.runner.visualstudio.
The test project must reference the Backend project so controller and service interfaces are available.
To run tests, use: dotnet test.
Scenarios not covered: exception handling paths, because HealthController does not implement custom error handling.
If additional configuration (e.g., test project .csproj) is needed, create it in the solution referencing these files.
No other controllers were found under Backend/Controllers in this branch.