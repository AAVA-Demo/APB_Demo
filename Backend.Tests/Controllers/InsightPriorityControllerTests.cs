using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightPriorityControllerTests
    {
        [Fact]
        public async Task GetPrioritizedInsights_ValidCaseId_ReturnsOkWithDto()
        {
            // Arrange
            var serviceMock = new Mock<IInsightPriorityService>();
            var expectedDto = new InsightListDto();
            serviceMock
                .Setup(s => s.GetPrioritizedInsights("case-1"))
                .ReturnsAsync(expectedDto);
            var controller = new InsightPriorityController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedInsights("case-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetPrioritizedInsights("case-1"), Times.Once);
        }

        [Fact]
        public async Task GetPrioritizedInsights_InvalidCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IInsightPriorityService>();
            serviceMock
                .Setup(s => s.GetPrioritizedInsights("invalid"))
                .ThrowsAsync(new ValidationException("invalid"));
            var controller = new InsightPriorityController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedInsights("invalid");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("invalid", badRequestResult.Value);
            serviceMock.Verify(s => s.GetPrioritizedInsights("invalid"), Times.Once);
        }

        [Fact]
        public async Task GetPrioritizedInsights_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IInsightPriorityService>();
            serviceMock
                .Setup(s => s.GetPrioritizedInsights("missing"))
                .ThrowsAsync(new CaseNotFoundException());
            var controller = new InsightPriorityController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedInsights("missing");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetPrioritizedInsights("missing"), Times.Once);
        }
    }
}
