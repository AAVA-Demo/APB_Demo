using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RemediationStepsControllerTests
    {
        [Fact]
        public async Task GetRemediationSteps_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedDto = new CaseRemediationStepsDto();
            var serviceMock = new Mock<IRemediationStepService>();

            serviceMock
                .Setup(s => s.GetRemediationStepsAsync(caseId))
                .ReturnsAsync(expectedDto);

            var controller = new RemediationStepsController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetRemediationStepsAsync(caseId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_EmptyCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            var controller = new RemediationStepsController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps(" ");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("CaseId is required.", badRequest.Value);
            serviceMock.Verify(s => s.GetRemediationStepsAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRemediationSteps_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var caseId = "missing-case";
            var serviceMock = new Mock<IRemediationStepService>();

            serviceMock
                .Setup(s => s.GetRemediationStepsAsync(caseId))
                .ThrowsAsync(new CaseNotFoundException());

            var controller = new RemediationStepsController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps(caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No remediation steps available for this case.", notFound.Value);
        }

        [Fact]
        public async Task GetRemediationSteps_IssuePatternNotRecognized_ReturnsNotFound()
        {
            // Arrange
            var caseId = "unrecognized-case";
            var serviceMock = new Mock<IRemediationStepService>();

            serviceMock
                .Setup(s => s.GetRemediationStepsAsync(caseId))
                .ThrowsAsync(new IssuePatternNotRecognizedException());

            var controller = new RemediationStepsController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps(caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No recognized issue pattern for this case.", notFound.Value);
        }
    }
}
