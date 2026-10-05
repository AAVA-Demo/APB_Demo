using System.Collections.Generic;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightControllerTests
    {
        [Fact]
        public void GetInsights_ValidCaseId_ReturnsOkWithInsights()
        {
            // Arrange
            var serviceMock = new Mock<IInsightIndicatorEnrichmentService>();
            var insights = new List<InsightIndicatorDto> { new InsightIndicatorDto() };
            serviceMock.Setup(s => s.GetInsightsWithIndicators("case-1")).Returns(insights);
            var controller = new InsightController(serviceMock.Object);

            // Act
            var result = controller.GetInsights("case-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(insights, okResult.Value);
            serviceMock.Verify(s => s.GetInsightsWithIndicators("case-1"), Times.Once);
        }

        [Fact]
        public void GetInsights_BlankCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IInsightIndicatorEnrichmentService>();
            var controller = new InsightController(serviceMock.Object);

            // Act
            var result = controller.GetInsights(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("caseId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.GetInsightsWithIndicators(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void GetInsights_NullOrEmptyInsights_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IInsightIndicatorEnrichmentService>();
            serviceMock.Setup(s => s.GetInsightsWithIndicators("case-1")).Returns(new List<InsightIndicatorDto>());
            var controller = new InsightController(serviceMock.Object);

            // Act
            var result = controller.GetInsights("case-1");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetInsightsWithIndicators("case-1"), Times.Once);
        }
    }
}
