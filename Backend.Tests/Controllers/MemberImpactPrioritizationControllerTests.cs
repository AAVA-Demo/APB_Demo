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
    public class MemberImpactPrioritizationControllerTests
    {
        private readonly Mock<IMemberImpactPrioritizationService> _serviceMock;
        private readonly MemberImpactPrioritizationController _controller;

        public MemberImpactPrioritizationControllerTests()
        {
            _serviceMock = new Mock<IMemberImpactPrioritizationService>();
            _controller = new MemberImpactPrioritizationController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetPrioritizedIssues_ValidMemberId_ReturnsOkWithResult()
        {
            var memberId = "member-1";
            var response = new MemberImpactIssuesResponse();
            _serviceMock.Setup(s => s.GetPrioritizedIssuesAsync(memberId))
                .ReturnsAsync(response);

            var result = await _controller.GetPrioritizedIssues(memberId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetPrioritizedIssuesAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetPrioritizedIssues_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var memberId = "bad-member";
            _serviceMock.Setup(s => s.GetPrioritizedIssuesAsync(memberId))
                .ThrowsAsync(new ArgumentException("invalid"));

            var result = await _controller.GetPrioritizedIssues(memberId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetPrioritizedIssuesAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetPrioritizedRecommendations_ValidMemberId_ReturnsOkWithResult()
        {
            var memberId = "member-1";
            var response = new MemberImpactRecommendationsResponse();
            _serviceMock.Setup(s => s.GetPrioritizedRecommendationsAsync(memberId))
                .ReturnsAsync(response);

            var result = await _controller.GetPrioritizedRecommendations(memberId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetPrioritizedRecommendationsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetPrioritizedRecommendations_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var memberId = "bad-member";
            _serviceMock.Setup(s => s.GetPrioritizedRecommendationsAsync(memberId))
                .ThrowsAsync(new ArgumentException("invalid"));

            var result = await _controller.GetPrioritizedRecommendations(memberId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetPrioritizedRecommendationsAsync(memberId), Times.Once);
        }
    }
}
