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
    public class DiagnosticInsightControllerTests
    {
        private readonly Mock<IDiagnosticInsightService> _serviceMock;
        private readonly DiagnosticInsightController _controller;

        public DiagnosticInsightControllerTests()
        {
            _serviceMock = new Mock<IDiagnosticInsightService>();
            _controller = new DiagnosticInsightController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetDiagnosticInsights_ValidInteractionId_ReturnsOkWithResult()
        {
            var interactionId = "interaction-1";
            var expected = new DiagnosticInsightResponseDto();
            _serviceMock.Setup(s => s.GetDiagnosticInsightsAsync(interactionId))
                .ReturnsAsync(expected);

            var result = await _controller.GetDiagnosticInsights(interactionId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.GetDiagnosticInsightsAsync(interactionId), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticInsights_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var interactionId = "interaction-2";
            _serviceMock.Setup(s => s.GetDiagnosticInsightsAsync(interactionId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.GetDiagnosticInsights(interactionId);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.GetDiagnosticInsightsAsync(interactionId), Times.Once);
        }

        [Fact]
        public async Task ProcessDiagnosticInsights_ValidRequest_ReturnsOkWithResult()
        {
            var request = new DiagnosticInsightProcessRequestDto { InteractionId = "interaction-3" };
            var expected = new DiagnosticInsightResponseDto();
            _serviceMock.Setup(s => s.ProcessDiagnosticInsightsAsync(request.InteractionId))
                .ReturnsAsync(expected);

            var result = await _controller.ProcessDiagnosticInsights(request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.ProcessDiagnosticInsightsAsync(request.InteractionId), Times.Once);
        }

        [Fact]
        public async Task ProcessDiagnosticInsights_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var request = new DiagnosticInsightProcessRequestDto { InteractionId = "interaction-4" };
            _serviceMock.Setup(s => s.ProcessDiagnosticInsightsAsync(request.InteractionId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.ProcessDiagnosticInsights(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.ProcessDiagnosticInsightsAsync(request.InteractionId), Times.Once);
        }
    }
}
