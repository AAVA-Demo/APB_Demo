using System.Threading.Tasks;
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
        public async Task GetRemediationSteps_ValidIds_ReturnsOkWithDto()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            var expectedDto = new RemediationStepsDto();
            serviceMock
                .Setup(s => s.GetRemediationSteps("case-1", "insight-1"))
                .ReturnsAsync(expectedDto);
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps("case-1", "insight-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetRemediationSteps("case-1", "insight-1"), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_InvalidIds_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            serviceMock
                .Setup(s => s.GetRemediationSteps("invalid", "insight-1"))
                .ThrowsAsync(new ValidationException("invalid"));
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps("invalid", "insight-1");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("invalid", badRequestResult.Value);
            serviceMock.Verify(s => s.GetRemediationSteps("invalid", "insight-1"), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_CaseOrInsightOrStepsNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IRemediationStepService>();
            serviceMock
                .Setup(s => s.GetRemediationSteps("case-1", "missing"))
                .ThrowsAsync(new RemediationStepsNotFoundException());
            var controller = new RemediationStepController(serviceMock.Object);

            // Act
            var result = await controller.GetRemediationSteps("case-1", "missing");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetRemediationSteps("case-1", "missing"), Times.Once);
        }
    }
}
