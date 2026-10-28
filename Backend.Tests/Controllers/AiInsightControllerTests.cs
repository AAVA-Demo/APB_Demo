using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class AiInsightControllerTests
    {
        private readonly Mock<IAiInsightService> _aiInsightServiceMock;
        private readonly AiInsightController _controller;

        public AiInsightControllerTests()
        {
            _aiInsightServiceMock = new Mock<IAiInsightService>();
            _controller = new AiInsightController(_aiInsightServiceMock.Object);
        }

        [Fact]
        public async Task GetAiInsightsWithConfidence_ResultExists_ReturnsOkWithResult()
        {
            // Arrange
            var interactionId = "interaction-1";
            var expectedResponse = new AiInsightsResponseDto();
            _aiInsightServiceMock.Setup(s => s.GetInsightsWithConfidence(interactionId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetAiInsightsWithConfidence(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _aiInsightServiceMock.Verify(s => s.GetInsightsWithConfidence(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetAiInsightsWithConfidence_ResultIsNull_ReturnsOkWithNull()
        {
            // Arrange
            var interactionId = "interaction-2";
            _aiInsightServiceMock.Setup(s => s.GetInsightsWithConfidence(interactionId)).ReturnsAsync((AiInsightsResponseDto)null);

            // Act
            var result = await _controller.GetAiInsightsWithConfidence(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Null(okResult.Value);
            _aiInsightServiceMock.Verify(s => s.GetInsightsWithConfidence(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetAiInsightsWithConfidence_ServiceThrows_PropagatesException()
        {
            // Arrange
            var interactionId = "interaction-3";
            _aiInsightServiceMock.Setup(s => s.GetInsightsWithConfidence(interactionId)).ThrowsAsync(new System.Exception("failure"));

            // Act & Assert
            await Assert.ThrowsAsync<System.Exception>(() => _controller.GetAiInsightsWithConfidence(interactionId));
            _aiInsightServiceMock.Verify(s => s.GetInsightsWithConfidence(interactionId), Times.Once);
        }
    }
}
