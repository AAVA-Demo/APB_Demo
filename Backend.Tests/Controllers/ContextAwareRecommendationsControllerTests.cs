using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class ContextAwareRecommendationsControllerTests
    {
        [Fact]
        public async Task GetContextAwareRecommendations_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedDto = new ContextAwareRecommendationsDto();
            var serviceMock = new Mock<IContextAwareRecommendationService>();
            serviceMock
                .Setup(s => s.GetContextAwareRecommendationsAsync(caseId))
                .ReturnsAsync(expectedDto);
            var controller = new ContextAwareRecommendationsController(serviceMock.Object);

            // Act
            var result = await controller.GetContextAwareRecommendations(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetContextAwareRecommendationsAsync(caseId), Times.Once);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_EmptyCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IContextAwareRecommendationService>();
            var controller = new ContextAwareRecommendationsController(serviceMock.Object);

            // Act
            var result = await controller.GetContextAwareRecommendations(" ");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("CaseId is required.", badRequest.Value);
            serviceMock.Verify(s => s.GetContextAwareRecommendationsAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_CaseNotFound_ProducesNotFound()
        {
            // Arrange
            var caseId = "missing-case";
            var serviceMock = new Mock<IContextAwareRecommendationService>();
            serviceMock
                .Setup(s => s.GetContextAwareRecommendationsAsync(caseId))
                .ThrowsAsync(new CaseNotFoundException());
            var controller = new ContextAwareRecommendationsController(serviceMock.Object);

            // Act
            var result = await controller.GetContextAwareRecommendations(caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No recommendations available for this case.", notFound.Value);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_ContextUnavailable_ReturnsServiceUnavailable()
        {
            // Arrange
            var caseId = "case-context-down";
            var serviceMock = new Mock<IContextAwareRecommendationService>();
            serviceMock
                .Setup(s => s.GetContextAwareRecommendationsAsync(caseId))
                .ThrowsAsync(new CaseContextUnavailableException());
            var controller = new ContextAwareRecommendationsController(serviceMock.Object);

            // Act
            var result = await controller.GetContextAwareRecommendations(caseId);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(503, statusCodeResult.StatusCode);
            Assert.Equal("Case context is temporarily unavailable.", statusCodeResult.Value);
        }
    }
}
