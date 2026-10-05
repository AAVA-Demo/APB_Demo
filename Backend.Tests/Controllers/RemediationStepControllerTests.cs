using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RemediationStepControllerTests
    {
        [Fact]
        public void GetRemediationSteps_ValidIds_ReturnsOkWithResponse()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            var response = new RemediationStepsResponseDto
            {
                Steps = new System.Collections.Generic.List<Backend.Dtos.RemediationStepDto> { new Backend.Dtos.RemediationStepDto() }
            };
            serviceMock.Setup(s => s.GetRemediationSteps("case-1", "issue-1")).Returns(response);
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = controller.GetRemediationSteps("case-1", "issue-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            serviceMock.Verify(s => s.GetRemediationSteps("case-1", "issue-1"), Times.Once);
        }

        [Fact]
        public void GetRemediationSteps_BlankCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = controller.GetRemediationSteps(" ", "issue-1");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("caseId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.GetRemediationSteps(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void GetRemediationSteps_BlankIssueId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = controller.GetRemediationSteps("case-1", " ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("issueId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.GetRemediationSteps(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void GetRemediationSteps_NoSteps_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            var response = new RemediationStepsResponseDto
            {
                Steps = new System.Collections.Generic.List<Backend.Dtos.RemediationStepDto>()
            };
            serviceMock.Setup(s => s.GetRemediationSteps("case-1", "issue-1")).Returns(response);
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = controller.GetRemediationSteps("case-1", "issue-1");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetRemediationSteps("case-1", "issue-1"), Times.Once);
        }
    }
}
