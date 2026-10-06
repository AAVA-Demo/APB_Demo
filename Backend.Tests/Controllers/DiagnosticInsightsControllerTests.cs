using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
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
            _controller = new DiagnosticInsightsController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetDiagnosticInsightsForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new DiagnosticInsightsResponseDto();
            _serviceResponse = new DiagnosticInsightsResponseDto();
            _serviceMock.Setup(s => s.GetInsights(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetDiagnosticInsightsForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetInsights(caseId), Times.Once);
        }

        [Fact]
        public async Task SubscribeInsightsRefreshStreamForCase_MultipleItems_YieldsAllItems()
        {
            // Arrange
            var caseId = "case-123";
            var items = new List<DiagnosticInsightsResponseDto>
            {
                new DiagnosticInsightsResponseDto(),
                new DiagnosticInsightsResponseDto()
            };
            async IAsyncEnumerable<DiagnosticInsightsResponseDto> Stream()
            {
                foreach (var item in items)
                {
                    yield return item;
                    await Task.Yield();
                }
            }
            _serviceMock.Setup(s => s.StreamInsights(caseId)).Returns(Stream());

            // Act
            var results = new List<DiagnosticInsightsResponseDto>();
            await foreach (var item in _controller.SubscribeInsightsRefreshStreamForCase(caseId))
            {
                results.Add(item);
            }

            // Assert
            Assert.Equal(items.Count, results.Count);
            Assert.Same(items[0], results[0]);
            Assert.Same(items[1], results[1]);
            _serviceMock.Verify(s => s.StreamInsights(caseId), Times.Once);
        }

        [Fact]
        public async Task TriggerManualInsightsRefreshForCase_ValidRequest_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var request = new TriggerManualInsightsRefreshRequestDto { CaseId = caseId };
            var expectedResponse = new InsightsRefreshStatusDto();
            _serviceMock.Setup(s => s.RefreshInsights(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.TriggerManualInsightsRefreshForCase(caseId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.RefreshInsights(caseId), Times.Once);
        }

        [Fact]
        public async Task TriggerManualInsightsRefreshForCase_CaseIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var caseId = "case-123";
            var request = new TriggerManualInsightsRefreshRequestDto { CaseId = "different" };

            // Act
            var result = await _controller.TriggerManualInsightsRefreshForCase(caseId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.RefreshInsights(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetInsightsRefreshStatusForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new InsightsRefreshStatusDto();
            _serviceMock.Setup(s => s.GetRefreshStatus(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetInsightsRefreshStatusForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetRefreshStatus(caseId), Times.Once);
        }
    }
}
