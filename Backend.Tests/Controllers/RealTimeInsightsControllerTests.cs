using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RealTimeInsightsControllerTests
    {
        [Fact]
        public async Task GetRealTimeInsights_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedDto = new CaseRealTimeInsightsDto();
            var serviceMock = new Mock<IDiagnosticInsightsService>();

            serviceMock
                .Setup(s => s.GetInsightsAsync(caseId))
                .ReturnsAsync(expectedDto);

            var controller = new RealTimeInsightsController(serviceMock.Object);

            // Act
            var result = await controller.GetRealTimeInsights(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetInsightsAsync(caseId), Times.Once);
        }

        [Fact]
        public async Task GetRealTimeInsights_EmptyCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightsService>();
            var controller = new RealTimeInsightsController(serviceMock.Object);

            // Act
            var result = await controller.GetRealTimeInsights(" ");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("CaseId is required.", badRequest.Value);
            serviceMock.Verify(s => s.GetInsightsAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRealTimeInsights_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var caseId = "missing-case";
            var serviceMock = new Mock<IDiagnosticInsightsService>();

            serviceMock
                .Setup(s => s.GetInsightsAsync(caseId))
                .ThrowsAsync(new CaseNotFoundException());

            var controller = new RealTimeInsightsController(serviceMock.Object);

            // Act
            var result = await controller.GetRealTimeInsights(caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Case not found.", notFound.Value);
        }

        [Fact]
        public async Task GetRealTimeInsights_TelemetryUnavailable_ReturnsServiceUnavailable()
        {
            // Arrange
            var caseId = "case-telemetry-down";
            var serviceMock = new Mock<IDiagnosticInsightsService>();

            serviceMock
                .Setup(s => s.GetInsightsAsync(caseId))
                .ThrowsAsync(new TelemetryUnavailableException());

            var controller = new RealTimeInsightsController(serviceMock.Object);

            // Act
            var result = await controller.GetRealTimeInsights(caseId);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(503, statusResult.StatusCode);
            Assert.Equal("Real-time telemetry is unavailable.", statusResult.Value);
        }
    }
}
