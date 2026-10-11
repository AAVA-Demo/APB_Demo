using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightsControllerTests
    {
        [Fact]
        public async Task GetInsightsWithConfidence_ValidCaseId_ReturnsOkWithDto()
        {
            // Arrange
            var caseId = "case-123";
            var insights = new object();
            var remediations = new object();
            var expectedDto = new CaseInsightsDto();

            var repoMock = new Mock<IInsightRepository>();
            var factoryMock = new Mock<IInsightDtoFactory>();

            repoMock.Setup(r => r.GetInsightsAsync(caseId)).ReturnsAsync(insights);
            repoMock.Setup(r => r.GetRemediationsAsync(caseId)).ReturnsAsync(remediations);
            factoryMock.Setup(f => f.Build(caseId, insights, remediations)).Returns(expectedDto);

            var controller = new InsightsController(repoMock.Object, factoryMock.Object);

            // Act
            var result = await controller.GetInsightsWithConfidence(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(expectedDto, okResult.Value);
            repoMock.Verify(r => r.GetInsightsAsync(caseId), Times.Once);
            repoMock.Verify(r => r.GetRemediationsAsync(caseId), Times.Once);
            factoryMock.Verify(f => f.Build(caseId, insights, remediations), Times.Once);
        }

        [Fact]
        public async Task GetInsightsWithConfidence_EmptyCaseId_ReturnsBadRequest()
        {
            // Arrange
            var repoMock = new Mock<IInsightRepository>();
            var factoryMock = new Mock<IInsightDtoFactory>();
            var controller = new InsightsController(repoMock.Object, factoryMock.Object);

            // Act
            var result = await controller.GetInsightsWithConfidence(" ");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("CaseId is required.", badRequest.Value);
            repoMock.Verify(r => r.GetInsightsAsync(It.IsAny<string>()), Times.Never);
            repoMock.Verify(r => r.GetRemediationsAsync(It.IsAny<string>()), Times.Never);
            factoryMock.Verify(f => f.Build(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<object>()), Times.Never);
        }

        [Fact]
        public async Task GetInsightsWithConfidence_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var caseId = "missing-case";
            var repoMock = new Mock<IInsightRepository>();
            var factoryMock = new Mock<IInsightDtoFactory>();

            repoMock
                .Setup(r => r.GetInsightsAsync(caseId))
                .ThrowsAsync(new CaseNotFoundException());

            var controller = new InsightsController(repoMock.Object, factoryMock.Object);

            // Act
            var result = await controller.GetInsightsWithConfidence(caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No insights available for this case.", notFound.Value);
        }

        [Fact]
        public async Task GetInsightsWithConfidence_InsightDataUnavailable_ReturnsServiceUnavailable()
        {
            // Arrange
            var caseId = "case-data-down";
            var repoMock = new Mock<IInsightRepository>();
            var factoryMock = new Mock<IInsightDtoFactory>();

            repoMock
                .Setup(r => r.GetInsightsAsync(caseId))
                .ThrowsAsync(new InsightDataUnavailableException());

            var controller = new InsightsController(repoMock.Object, factoryMock.Object);

            // Act
            var result = await controller.GetInsightsWithConfidence(caseId);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(503, statusResult.StatusCode);
            Assert.Equal("Insight data is temporarily unavailable.", statusResult.Value);
        }
    }
}
