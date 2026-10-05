using System;
using System.Collections.Generic;
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
        public async Task GetRemediationSteps_ValidMemberId_ReturnsOkWithSteps()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var steps = new List<RemediationStepDto> { new RemediationStepDto() };
            _serviceMock
                .Setup(s => s.GetRemediationStepsAsync(memberId))
                .ReturnsAsync(steps);

            // Act
            var result = await _controller.GetRemediationSteps(memberId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(steps, okResult.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_EmptyMemberId_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;

            // Act
            var result = await _controller.GetRemediationSteps(memberId);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task GetRemediationSteps_NoSteps_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var steps = new List<RemediationStepDto>();
            _serviceMock
                .Setup(s => s.GetRemediationStepsAsync(memberId))
                .ReturnsAsync(steps);

            // Act
            var result = await _controller.GetRemediationSteps(memberId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task UpdateRemediationStepStatus_ValidInput_ReturnsOkWithUpdatedStep()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var stepId = Guid.NewGuid();
            var request = new UpdateRemediationStepStatusRequest();
            var updated = new RemediationStepDto();
            _serviceMock
                .Setup(s => s.UpdateRemediationStepStatusAsync(memberId, stepId, request))
                .ReturnsAsync(updated);

            // Act
            var result = await _controller.UpdateRemediationStepStatus(memberId, stepId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(updated, okResult.Value);
            _serviceMock.Verify(s => s.UpdateRemediationStepStatusAsync(memberId, stepId, request), Times.Once);
        }

        [Fact]
        public async Task UpdateRemediationStepStatus_InvalidIds_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;
            var stepId = Guid.NewGuid();
            var request = new UpdateRemediationStepStatusRequest();

            // Act
            var result = await _controller.UpdateRemediationStepStatus(memberId, stepId, request);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            _serviceMock.Verify(s => s.UpdateRemediationStepStatusAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<UpdateRemediationStepStatusRequest>()), Times.Never);
        }
    }
}
