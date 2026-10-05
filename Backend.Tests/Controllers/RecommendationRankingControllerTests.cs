using System;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RecommendationRankingControllerTests
    {
        private readonly Mock<IRecommendationRankingService> _serviceMock;
        private readonly RecommendationRankingController _controller;

        public RecommendationRankingControllerTests()
        {
            _serviceMock = new Mock<IRecommendationRankingService>();
            _controller = new RecommendationRankingController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRankedRecommendations_ValidInteractionId_ReturnsOkWithResult()
        {
            var interactionId = "interaction-1";
            var expected = new RankedRecommendationResponseDto();
            _serviceMock.Setup(s => s.GetRankedRecommendationsAsync(interactionId))
                .ReturnsAsync(expected);

            var result = await _controller.GetRankedRecommendations(interactionId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.GetRankedRecommendationsAsync(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetRankedRecommendations_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var interactionId = "interaction-2";
            _serviceMock.Setup(s => s.GetRankedRecommendationsAsync(interactionId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.GetRankedRecommendations(interactionId);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.GetRankedRecommendationsAsync(interactionId), Times.Once);
        }

        [Fact]
        public async Task RankRecommendations_ValidRequest_ReturnsOkWithResult()
        {
            var request = new RecommendationRankRequestDto();
            var expected = new RankedRecommendationResponseDto();
            _serviceMock.Setup(s => s.RankRecommendationsAsync(request))
                .ReturnsAsync(expected);

            var result = await _controller.RankRecommendations(request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.RankRecommendationsAsync(request), Times.Once);
        }

        [Fact]
        public async Task RankRecommendations_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var request = new RecommendationRankRequestDto();
            _serviceMock.Setup(s => s.RankRecommendationsAsync(request))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.RankRecommendations(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.RankRecommendationsAsync(request), Times.Once);
        }
    }
}
