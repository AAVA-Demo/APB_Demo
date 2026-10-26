using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightRefreshControllerTests
    {
        [Fact]
        public async Task GetCurrentInsights_ValidCaseId_ReturnsOkWithDto()
        {
            // Arrange
            var serviceMock = new Mock<IInsightRefreshService>();
            var expectedDto = new CurrentInsightsDto();
            serviceMock
                .Setup(s => s.GetCurrentInsights("case-1"))
                .ReturnsAsync(expectedDto);
            var controller = new InsightRefreshController(serviceMock.Object);

            // Act
            var result = await controller.GetCurrentInsights("case-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetCurrentInsights("case-1"), Times.Once);
        }

        [Fact]
        public async Task GetCurrentInsights_InvalidCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IInsightRefreshService>();
            serviceMock
                .Setup(s => s.GetCurrentInsights("invalid"))
                .ThrowsAsync(new ValidationException("invalid"));
            var controller = new InsightRefreshController(serviceMock.Object);

            // Act
            var result = await controller.GetCurrentInsights("invalid");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("invalid", badRequestResult.Value);
            serviceMock.Verify(s => s.GetCurrentInsights("invalid"), Times.Once);
        }

        [Fact]
        public async Task GetCurrentInsights_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IInsightRefreshService>();
            serviceMock
                .Setup(s => s.GetCurrentInsights("missing"))
                .ThrowsAsync(new CaseNotFoundException());
            var controller = new InsightRefreshController(serviceMock.Object);

            // Act
            var result = await controller.GetCurrentInsights("missing");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetCurrentInsights("missing"), Times.Once);
        }
    }
}
