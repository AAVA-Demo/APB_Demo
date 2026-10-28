using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class GuidedActionLogControllerTests
    {
        private readonly Mock<IAuditLogService> _auditLogServiceMock;
        private readonly GuidedActionLogController _controller;

        public GuidedActionLogControllerTests()
        {
            _auditLogServiceMock = new Mock<IAuditLogService>();
            _controller = new GuidedActionLogController(_auditLogServiceMock.Object);
        }

        [Fact]
        public async Task PostLogGuidedActionExecution_ValidRequest_SetsInteractionIdAndReturnsOk()
        {
            // Arrange
            var interactionId = "interaction-1";
            var request = new LogGuidedActionExecutionRequestDto();
            var expectedResponse = new LogGuidedActionExecutionResponseDto();
            _auditLogServiceMock.Setup(s => s.CreateGuidedActionLog(request)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.PostLogGuidedActionExecution(interactionId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            Assert.Equal(interactionId, request.InteractionId);
            _auditLogServiceMock.Verify(s => s.CreateGuidedActionLog(request), Times.Once);
        }

        [Fact]
        public async Task PostLogGuidedActionExecution_NullRequest_ThrowsArgumentNullException()
        {
            // Arrange
            var interactionId = "interaction-2";

            // Act & Assert
            await Assert.ThrowsAsync<System.ArgumentNullException>(() => _controller.PostLogGuidedActionExecution(interactionId, null));
            _auditLogServiceMock.Verify(s => s.CreateGuidedActionLog(It.IsAny<LogGuidedActionExecutionRequestDto>()), Times.Never);
        }

        [Fact]
        public async Task GetGuidedActionExecutionLogs_LogsExist_ReturnsOkWithLogs()
        {
            // Arrange
            var interactionId = "interaction-3";
            var expectedLogs = new List<GuidedActionExecutionLog> { new GuidedActionExecutionLog() };
            _auditLogServiceMock.Setup(s => s.GetGuidedActionLogsByInteraction(interactionId)).ReturnsAsync(expectedLogs);

            // Act
            var result = await _controller.GetGuidedActionExecutionLogs(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedLogs, okResult.Value);
            _auditLogServiceMock.Verify(s => s.GetGuidedActionLogsByInteraction(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetGuidedActionExecutionLogs_NoLogs_ReturnsOkWithEmptyList()
        {
            // Arrange
            var interactionId = "interaction-4";
            var expectedLogs = new List<GuidedActionExecutionLog>();
            _auditLogServiceMock.Setup(s => s.GetGuidedActionLogsByInteraction(interactionId)).ReturnsAsync(expectedLogs);

            // Act
            var result = await _controller.GetGuidedActionExecutionLogs(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var logs = Assert.IsAssignableFrom<IEnumerable<GuidedActionExecutionLog>>(okResult.Value);
            Assert.Empty(logs);
            _auditLogServiceMock.Verify(s => s.GetGuidedActionLogsByInteraction(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetGuidedActionExecutionLogs_ServiceThrows_PropagatesException()
        {
            // Arrange
            var interactionId = "interaction-5";
            _auditLogServiceMock.Setup(s => s.GetGuidedActionLogsByInteraction(interactionId)).ThrowsAsync(new System.Exception("failure"));

            // Act & Assert
            await Assert.ThrowsAsync<System.Exception>(() => _controller.GetGuidedActionExecutionLogs(interactionId));
            _auditLogServiceMock.Verify(s => s.GetGuidedActionLogsByInteraction(interactionId), Times.Once);
        }
    }
}
