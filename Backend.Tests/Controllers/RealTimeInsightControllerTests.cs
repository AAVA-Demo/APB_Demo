using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RealTimeInsightControllerTests
    {
        [Fact]
        public void GetRealTimeInsights_ValidCaseId_ReturnsOkWithResponse()
        {
            // Arrange
            var serviceMock = new Mock<IRealTimeInsightService>();
            var response = new RealTimeInsightsResponseDto
            {
                Insights = new System.Collections.Generic.List<Backend.Dtos.RealTimeInsightDto> { new Backend.Dtos.RealTimeInsightDto() }
            };
            serviceMock.Setup(s => s.GetRealTimeInsights("case-1")).Returns(response);
            var controller = new RealTimeInsightController(serviceMock.Object);

            // Act
            var result = controller.GetRealTimeInsights("case-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            serviceMock.Verify(s => s.GetRealTimeInsights("case-1"), Times.Once);
        }

        [Fact]
        public void GetRealTimeInsights_BlankCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRealTimeInsightService>();
            var controller = new RealTimeInsightController(serviceMock.Object);

            // Act
            var result = controller.GetRealTimeInsights(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("caseId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.GetRealTimeInsights(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void GetRealTimeInsights_NoInsights_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IRealTimeInsightService>();
            var response = new RealTimeInsightsResponseDto
            {
                Insights = new System.Collections.Generic.List<Backend.Dtos.RealTimeInsightDto>()
            };
            serviceMock.Setup(s => s.GetRealTimeInsights("case-1")).Returns(response);
            var controller = new RealTimeInsightController(serviceMock.Object);

            // Act
            var result = controller.GetRealTimeInsights("case-1");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetRealTimeInsights("case-1"), Times.Once);
        }
    }
}
