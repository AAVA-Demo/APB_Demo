using System;
using System.Text.Json;
using System.Threading;
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
    public class DiagnosticInsightsControllerTests
    {
        private readonly Mock<IDiagnosticInsightsService> _serviceMock;
        private readonly DiagnosticInsightsController _controller;

        public DiagnosticInsightsControllerTests()
        {
            _serviceMock = new Mock<IDiagnosticInsightsService>();
            _controller = new DiagnosticInsightsController(_serviceMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };
        }

        [Fact]
        public async Task GetCurrentInsights_ValidMemberId_ReturnsOkWithResult()
        {
            var memberId = "member-1";
            var response = new DiagnosticInsightsResponse();
            _serviceMock.Setup(s => s.GetCurrentInsightsAsync(memberId))
                .ReturnsAsync(response);

            var result = await _controller.GetCurrentInsights(memberId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetCurrentInsightsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetCurrentInsights_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var memberId = "bad-member";
            _serviceMock.Setup(s => s.GetCurrentInsightsAsync(memberId))
                .ThrowsAsync(new ArgumentException("invalid member"));

            var result = await _controller.GetCurrentInsights(memberId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetCurrentInsightsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task StreamInsights_WritesEventsForEachInsight()
        {
            var memberId = "member-stream";
            var tcs = new TaskCompletionSource<bool>();
            var response = _controller.Response;
            response.Body = new System.IO.MemoryStream();

            async IAsyncEnumerable<DiagnosticInsightsResponse> Stream(CancellationToken token)
            {
                yield return new DiagnosticInsightsResponse();
                tcs.SetResult(true);
                await Task.CompletedTask;
            }

            _serviceMock.Setup(s => s.SubscribeInsightsStreamAsync(memberId, It.IsAny<CancellationToken>()))
                .Returns(Stream(It.IsAny<CancellationToken>()));

            await _controller.StreamInsights(memberId);

            Assert.Equal("text/event-stream", response.ContentType);
            _serviceMock.Verify(s => s.SubscribeInsightsStreamAsync(memberId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
