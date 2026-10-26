using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RecommendationExplanationControllerTests
    {
        [Fact]
        public async Task GetRecommendationExplanation_ValidIds_ReturnsOkWithDto()
        {
            // Arrange
            var serviceMock = new Mock<IRecommendationExplanationService>();
            var expectedDto = new RecommendationExplanationDto();
            serviceMock
                .Setup(s => s.GetRecommendationExplanation("case-1", "insight-1", "rec-1"))
                .ReturnsAsync(expectedDto);
            var controller = new RecommendationExplanationController(serviceMock.Object);

            // Act
            var result = await controller.GetRecommendationExplanation("case-1", "insight-1", "rec-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetRecommendationExplanation("case-1", "insight-1", "rec-1"), Times.Once);
        }

        [Fact]
        public async Task GetRecommendationExplanation_INVALIDIds_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRecommendationExplanationService>();
            serviceMock
                .Setup(s => s.GetRecommendationExplanation("invalid", "insight-1", "rec-1"))
                .ThrowsAsync(new ValidationException("invalid"));
            var controller = new RecommendationExplanationController(serviceMock.Object);

            // Act
            var result = await controller.GetRecommendationExplanation("invalid", "insight-1", "rec-1");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("invalid", badRequestResult.Value);
            serviceMock.Verify(s => s.GetRecommendationExplanation("invalid", "insight-1", "rec-1"), Times.Once);
        }

        [Fact]
        public async Task GetRecommendationExplanation_CaseOrInsightOrRecommendationNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IRecommendationExplanationService>();
            serviceMock
                .Setup(s => s.GetRecommendationExplanation("case-1", "insight-1", "missing"))
                .ThrowsAsync(new RecommendationNotFoundException());
            var controller = new RecommendationExplanationController(serviceMock.Object);

            // Act
            var result = await controller.GetRecommendationExplanation("case-1", "insight-1", "missing");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetRecommendationExplanation("case-1", "insight-1", "missing"), Times.Once);
        }
    }
}
