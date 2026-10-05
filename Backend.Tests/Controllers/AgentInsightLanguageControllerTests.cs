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
    public class AgentInsightLanguageControllerTests
    {
        private readonly Mock<IAgentInsightLanguageService> _serviceMock;
        private readonly AgentInsightLanguageController _controller;

        public AgentInsightLanguageControllerTests()
        {
            _serviceMock = new Mock<IAgentInsightLanguageService>();
            _controller = new AgentInsightLanguageController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetAgentFriendlyInsights_ValidInteractionId_ReturnsOkWithResult()
        {
            var interactionId = "interaction-1";
            var expected = new AgentInsightResponseDto();
            _serviceMock.Setup(s => s.GetAgentFriendlyInsightsAsync(interactionId))
                .ReturnsAsync(expected);

            var result = await _controller.GetAgentFriendlyInsights(interactionId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.GetAgentFriendlyInsightsAsync(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetAgentFriendlyInsights_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var interactionId = "interaction-2";
            _serviceMock.Setup(s => s.GetAgentFriendlyInsightsAsync(interactionId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.GetAgentFriendlyInsights(interactionId);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.GetAgentFriendlyInsightsAsync(interactionId), Times.Once);
        }

        [Fact]
        public async Task TransformRawInsights_ValidRequest_ReturnsOkWithResult()
        {
            var request = new AgentInsightTransformRequestDto();
            var expected = new AgentInsightResponseDto();
            _serviceMock.Setup(s => s.TransformRawInsightsAsync(request))
                .ReturnsAsync(expected);

            var result = await _controller.TransformRawInsights(request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.TransformRawInsightsAsync(request), Times.Once);
        }

        [Fact]
        public async Task TransformRawInsights_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var request = new AgentInsightTransformRequestDto();
            _serviceMock.Setup(s => s.TransformRawInsightsAsync(request))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.TransformRawInsights(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.TransformRawInsightsAsync(request), Times.Once);
        }
    }
}
