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
        private readonly DiagnosticInsightsController _controller;

        public DiagnosticInsightsControllerTests()
        {
            _serviceMock = new Mock<IDiagnosticInsightsService>();
            _controller = new DiagnosticInsightsController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetDiagnosticInsights_ValidMemberId_ReturnsOkWithInsights()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var insights = new List<DiagnosticInsightDto> { new DiagnosticInsightDto() };
            _serviceMock
                .Setup(s => s.GetDiagnosticInsightsAsync(memberId))
                .ReturnsAsync(insights);

            // Act
            var result = await _controller.GetDiagnosticInsights(memberId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(insights, okResult.Value);
            _serviceMock.Verify(s => s.GetDiagnosticInsightsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticInsights_EmptyMemberId_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;

            // Act
            var result = await _controller.GetDiagnosticInsights(memberId);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            _serviceMock.Verify(s => s.GetDiagnosticInsightsAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task GetDiagnosticInsights_NoInsights_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            _serviceMock
                .Setup(s => s.GetDiagnosticInsightsAsync(memberId))
                .ReturnsAsync(Enumerable.Empty<DiagnosticInsightDto>());

            // Act
            var result = await _controller.GetDiagnosticInsights(memberId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.GetDiagnosticInsightsAsync(memberId), Times.Once);
        }
    }
}
