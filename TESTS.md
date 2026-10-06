Controllers under Backend/Controllers were not found in the APB_Demo repository for the specified branch.
No unit test files were generated because there are no controller classes to target.
To enable controller unit testing, ensure that Backend/Controllers exists and contains controller classes.
Once controllers are available, tests should be added under Backend.Tests/Controllers/<ControllerName>Tests.cs.
Required packages for the future test project: xunit, Moq, Microsoft.NET-Test.Sdk, xunit.runner.visualstudio.
The test project must reference the Backend project to access controller types.
Tests can be executed using the command: dotnet test.
No scenarios were skipped; there are currently no controller behaviors to validate.