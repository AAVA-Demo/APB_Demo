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
    public class RealTimeDiagnosticInsightsControllerTests
    {
        private readonly Mock<IRealTimeDiagnosticInsightsService> _serviceMock;
        private readonly RealTimeDiagnosticInsightsController _controller;

        public RealTimeDiagnosticInsightsControllerTests()
        {
            _serviceMock = new Mock<IRealTimeDiagnosticInsightsService>();
            _controller = new RealTimeDiagnosticInsightsController(_serviceMock.Object);
        }

        [Fact]
        public async Task AnalyzeCaseRealTime_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var request = new AnalyzeCaseRequestDto { CaseId = caseId };
            var expectedResponse = new RealTimeInsightsAnalysisResponseDto();
            _serviceMock.Setup(s => s.AnalyzeCase(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.AnalyzeCaseRealTime(caseId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.AnalyzeCase(caseId), Times.Once);
        }

        [Fact]
        public async Task AnalyzeCaseRealTime_CaseIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var caseId = "case-123";
            var request = new AnalyzeCaseRequestDto { CaseId = "different" };

            // Act
            var result = await _controller.AnalyzeCaseRealTime(caseId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.AnalyzeCase(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRealTimeInsightsForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new RealTimeInsightsResponseDto();
            _serviceMock.Setup(s => s.GetInsights(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetRealTimeInsightsForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetInsights(caseId), Times.Once);
        }

        [Fact]
        public async Task SubscribeRealTimeInsightsStreamForCase_MultipleItems_YieldsAllItems()
        {
            // Arrange
            var caseId = "case-123";
            var items = new List<RealTimeInsightsResponseDto>
            {
                new RealTimeInsightsResponseDto(),
                new RealTimeInsightsResponseDto()
            };
            async IAsyncEnumerable<RealTimeInsightsResponseDto> Stream()
            {
                foreach (var item in items)
                {
                    yield return item;
                    await Task.Yield();
                }
            }
            _serviceMock.Setup(s => s.StreamInsights(caseId)).Returns(Stream());

            // Act
            var results = new List<RealTimeInsightsResponseDto>();
            await foreach (var item in _controller.SubscribeRealTimeInsightsStreamForCase(caseId))
            {
                results.Add(item);
            }

            // Assert
            Assert.Equal(items.Count, results.Count);
            Assert.Same(items[0], results[0]);
            Assert.Same(items[1], results[1]);
            _serviceMock.Verify(s => s.StreamInsights(caseId), Times.Once);
        }
    }
}
