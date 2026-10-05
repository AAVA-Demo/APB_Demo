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
    public class RecommendationsControllerTests
    {
        private readonly Mock<IRecommendationsService> _serviceMock;
        private readonly RecommendationsController _controller;

        public RecommendationsControllerTests()
        {
            _serviceMock = new Mock<IRecommendationsService>();
            _controller = new RecommendationsController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRecommendations_ValidMemberId_ReturnsOkWithRecommendations()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var recommendations = new List<RecommendationDto> { new RecommendationDto() };
            _serviceMock
                .Setup(s => s.GetRecommendationsAsync(memberId))
                .ReturnsAsync(recommendations);

            // Act
            var result = await _controller.GetRecommendations(memberId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(recommendations, okResult.Value);
            _serviceMock.Verify(s => s.GetRecommendationsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetRecommendations_EmptyMemberId_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;

            // Act
            var result = await _controller.GetRecommendations(memberId);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            _serviceMock.Verify(s => s.GetRecommendationsAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task GetRecommendations_NoRecommendations_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            _serviceMock
                .Setup(s => s.GetRecommendationsAsync(memberId))
                .ReturnsAsync(Enumerable.Empty<RecommendationDto>());

            // Act
            var result = await _controller.GetRecommendations(memberId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.GetRecommendationsAsync(memberId), Times.Once);
        }
    }
}
