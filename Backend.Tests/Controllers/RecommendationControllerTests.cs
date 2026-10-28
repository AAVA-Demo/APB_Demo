using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RecommendationControllerTests
    {
        private readonly Mock<IRecommendationService> _recommendationServiceMock;
        private readonly RecommendationController _controller;

        public RecommendationControllerTests()
        {
            _recommendationServiceMock = new Mock<IRecommendationService>();
            _controller = new RecommendationController(_recommendationServiceMock.Object);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_ResultExists_ReturnsOkWithResult()
        {
            // Arrange
            var interactionId = "interaction-1";
            var expectedResponse = new ContextAwareRecommendationsResponseDto();
            _recommendationServiceMock.Setup(s => s.GetContextAwareRecommendations(interactionId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetContextAwareRecommendations(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _recommendationServiceMock.Verify(s => s.GetContextAwareRecommendations(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_ResultIsNull_ReturnsOkWithNull()
        {
            // Arrange
            var interactionId = "interaction-2";
            _recommendationServiceMock.Setup(s => s.GetContextAwareRecommendations(interactionId)).ReturnsAsync((ContextAwareRecommendationsResponseDto)null);

            // Act
            var result = await _controller.GetContextAwareRecommendations(interactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Null(okResult.Value);
            _recommendationServiceMock.Verify(s => s.GetContextAwareRecommendations(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_ServiceThrows_PropagatesException()
        {
            // Arrange
            var interactionId = "interaction-3";
            _recommendationServiceMock.Setup(s => s.GetContextAwareRecommendations(interactionId)).ThrowsAsync(new System.Exception("failure"));

            // Act & Assert
            await Assert.ThrowsAsync<System.Exception>(() => _controller.GetContextAwareRecommendations(interactionId));
            _recommendationServiceMock.Verify(s => s.GetContextAwareRecommendations(interactionId), Times.Once);
        }
    }
}
