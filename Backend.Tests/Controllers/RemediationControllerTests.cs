using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RemediationControllerTests
    {
        private readonly Mock<IRemediationService> _serviceMock;
        private readonly RemediationController _controller;

        public RemediationControllerTests()
        {
            _serviceMock = new Mock<IRemediationService>();
            _controller = new RemediationController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRemediationSteps_ValidInsightIdWithSteps_ReturnsOkWithSteps()
        {
            // Arrange
            var insightId = Guid.NewGuid();
            var steps = new List<RemediationStepDto> { new RemediationStepDto(), new RemediationStepDto() };
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(insightId)).ReturnsAsync(steps);

            // Act
            var result = await _controller.GetRemediationSteps(insightId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(steps, okResult.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(insightId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_NoStepsFound_ReturnsNotFound()
        {
            // Arrange
            var insightId = Guid.NewGuid();
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(insightId)).ReturnsAsync(Enumerable.Empty<RemediationStepDto>());

            // Act
            var result = await _controller.GetRemediationSteps(insightId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(insightId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_InvalidInsightId_ReturnsBadRequest()
        {
            // Arrange
            var insightId = Guid.Empty;

            // Act
            var result = await _controller.GetRemediationSteps(insightId);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid insightId.", badRequest.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(It.IsAny<Guid>()), Times.Never);
        }
    }
}
