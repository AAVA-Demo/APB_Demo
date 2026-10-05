using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightRefreshControllerTests
    {
        private readonly Mock<IInsightRefreshService> _serviceMock;
        private readonly InsightRefreshController _controller;

        public InsightRefreshControllerTests()
        {
            _serviceMock = new Mock<IInsightRefreshService>();
            _controller = new InsightRefreshController(_serviceMock.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
        }

        [Fact]
        public async Task StreamInsights_ValidInteractionId_WritesToResponse()
        {
            var interactionId = "interaction-1";
            var updates = GetAsyncEnumerable("update-1", "update-2");
            _serviceMock.Setup(s => s.SubscribeAsync(interactionId))
                .Returns(updates);

            await _controller.StreamInsights(interactionId);

            _serviceMock.Verify(s => s.SubscribeAsync(interactionId), Times.Once);
            Assert.Equal("text/event-stream", _controller.Response.ContentType);
            _controller.Response.Body.Seek(0, SeekOrigin.Begin);
            using var reader = new StreamReader(_controller.Response.Body, Encoding.UTF8);
            var content = await reader.ReadToEndAsync();
            Assert.False(string.IsNullOrEmpty(content));
        }

        [Fact]
        public async Task TriggerRefresh_ValidRequest_ReturnsOkWithResult()
        {
            var request = new InsightRefreshRequestDto { InteractionId = "interaction-2" };
            var expected = new InsightRefreshResponseDto();
            _serviceMock.Setup(s => s.RefreshInsightsAsync(request.InteractionId))
                .ReturnsAsync(expected);

            var result = await _controller.TriggerRefresh(request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.RefreshInsightsAsync(request.InteractionId), Times.Once);
        }

        [Fact]
        public async Task TriggerRefresh_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var request = new InsightRefreshRequestDto { InteractionId = "interaction-3" };
            _serviceMock.Setup(s => s.RefreshInsightsAsync(request.InteractionId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.TriggerRefresh(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.RefreshInsightsAsync(request.InteractionId), Times.Once);
        }

        private static async IAsyncEnumerable<string> GetAsyncEnumerable(params string[] values)
        {
            foreach (var value in values)
            {
                await Task.Yield();
                yield return value;
            }
        }
    }
}
