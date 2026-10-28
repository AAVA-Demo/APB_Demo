using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class AiDiagnosticControllerTests
    {
        private readonly Mock<IAiDiagnosticService> _aiDiagnosticServiceMock;
        private readonly AiDiagnosticController _controller;

        public AiDiagnosticControllerTests()
        {
            _aiDiagnosticServiceMock = new Mock<IAiDiagnosticService>();
            _controller = new AiDiagnosticController(_aiDiagnosticServiceMock.Object);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_ResultExists_ReturnsOkWithResult()
        {
            // Arrange
            var interactionId = "interaction-1";
            var expectedResponse = new RealTimeDiagnosticInsightsResponseDto();
            _aiDiagnosticServiceMock.Setup(s => s.GetRealTimeDiagnosticInsights(interactionId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetRealTimeDiagnosticInsights(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _aiDiagnosticServiceMock.Verify(s => s.GetRealTimeDiagnosticInsights(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_ResultIsNull_ReturnsOkWithNull()
        {
            // Arrange
            var interactionId = "interaction-2";
            _aiDiagnosticServiceMock.Setup(s => s.GetRealTimeDiagnosticInsights(interactionId)).ReturnsAsync((RealTimeDiagnosticInsightsResponseDto)null);

            // Act
            var result = await _controller.GetRealTimeDiagnosticInsights(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Null(okResult.Value);
            _aiDiagnosticServiceMock.Verify(s => s.GetRealTimeDiagnosticInsights(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_ServiceThrows_PropagatesException()
        {
            // Arrange
            var interactionId = "interaction-3";
            _aiDiagnosticServiceMock.Setup(s => s.GetRealTimeDiagnosticInsights(interactionId)).ThrowsAsync(new System.Exception("failure"));

            // Act & Assert
            await Assert.ThrowsAsync<System.Exception>(() => _controller.GetRealTimeDiagnosticInsights(interactionId));
            _aiDiagnosticServiceMock.Verify(s => s.GetRealTimeDiagnosticInsights(interactionId), Times.Once);
        }
    }
}
