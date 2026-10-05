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
    public class DiagnosticInsightsControllerTests
    {
        private readonly Mock<IDiagnosticInsightsService> _serviceMock;
        private readonly Mock<IRealTimeUpdatePublisher> _publisherMock;
        private readonly DiagnosticInsightsController _controller;

        public DiagnosticInsightsControllerTests()
        {
            _serviceMock = new Mock<IDiagnosticInsightsService>();
            _publisherMock = new Mock<IRealTimeUpdatePublisher>();
            _controller = new DiagnosticInsightsController(_serviceMock.Object, _publisherMock.Object);
        }

        [Fact]
        public async Task GetInsights_ValidIssueIdWithInsights_ReturnsOkWithInsights()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var insights = new List<InsightDto> { new InsightDto(), new InsightDto() };
            _serviceMock.Setup(s => s.GetInsightsAsync(issueId)).ReturnsAsync(insights);

            // Act
            var result = await _controller.GetInsights(issueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(insights, okResult.Value);
            _serviceMock.Verify(s => s.GetInsightsAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetInsights_NoInsightsFound_ReturnsNotFound()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _serviceMock.Setup(s => s.GetInsightsAsync(issueId)).ReturnsAsync(Enumerable.Empty<InsightDto>());

            // Act
            var result = await _controller.GetInsights(issueId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _serviceMock.Verify(s => s.GetInsightsAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetInsights_InvalidIssueId_ReturnsBadRequest()
        {
            // Arrange
            var issueId = Guid.Empty;

            // Act
            var result = await _controller.GetInsights(issueId);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid issueId.", badRequest.Value);
            _serviceMock.Verify(s => s.GetInsightsAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public void GetInsightStream_ValidIssueIdWithConnection_ReturnsOkWithConnection()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var connection = new RealTimeConnectionDto();
            _publisherMock.Setup(p => p.NegotiateConnection(issueId)).Returns(connection);

            // Act
            var result = _controller.GetInsightStream(issueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(connection, okResult.Value);
            _publisherMock.Verify(p => p.NegotiateConnection(issueId), Times.Once);
        }

        [Fact]
        public async Task RefreshInsights_InvalidRequest_ReturnsBadRequest()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var request = new InsightRefreshRequestDto { IssueId = Guid.Empty };

            // Act
            var result = await _controller.RefreshInsights(issueId, request);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid request.", badRequest.Value);
            _serviceMock.Verify(s => s.TriggerRefreshAsync(It.IsAny<Guid>(), It.IsAny<string>()), Times.Never);
        }
    }
}
