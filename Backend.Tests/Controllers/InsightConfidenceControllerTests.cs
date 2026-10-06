using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightConfidenceControllerTests
    {
        private readonly Mock<IInsightConfidenceService> _serviceMock;
        private readonly InsightConfidenceController _controller;

        public InsightConfidenceControllerTests()
        {
            _serviceMock = new Mock<IInsightConfidenceService>();
            _controller = new InsightConfidenceController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetInsightsWithConfidenceForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new InsightsWithConfidenceResponseDto();
            _serviceMock.Setup(s => s.GetInsightsWithConfidence(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetInsightsWithConfidenceForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetInsightsWithConfidence(caseId), Times.Once);
        }

        [Fact]
        public async Task GetInsightConfidenceDetails_ValidInsightId_ReturnsOkWithResult()
        {
            // Arrange
            var insightId = "insight-123";
            var expectedResponse = new InsightConfidenceDetailsDto();
            _serviceMock.Setup(s => s.GetConfidenceDetails(insightId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetInsightConfidenceDetails(insightId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetConfidenceDetails(insightId), Times.Once);
        }
    }
}
