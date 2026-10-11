using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class ResolutionsControllerTests
    {
        [Fact]
        public async Task GetPrioritizedResolutions_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedDto = new CaseResolutionsDto();
            var serviceMock = new Mock<IResolutionSuggestionService>();

            serviceMock
                .Setup(s => s.GetPrioritizedResolutionsAsync(caseId))
                .ReturnsAsync(expectedDto);

            var controller = new ResolutionsController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedResolutions(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetPrioritizedResolutionsAsync(caseId), Times.Once);
        }

        [Fact]
        public async Task GetPrioritizedResolutions_EmptyCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IResolutionSuggestionService>();
            var controller = new ResolutionsController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedResolutions(" ");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("CaseId is required.", badRequest.Value);
            serviceMock.Verify(s => s.GetPrioritizedResolutionsAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetPrioritizedResolutions_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var caseId = "missing-case";
            var serviceMock = new Mock<IResolutionSuggestionService>();

            serviceMock
                .Setup(s => s.GetPrioritizedResolutionsAsync(caseId))
                .ThrowsAsync(new CaseNotFoundException());

            var controller = new ResolutionsController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedResolutions(caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No resolution suggestions available for this case.", notFound.Value);
        }

        [Fact]
        public async Task GetPrioritizedResolutions_DataUnavailable_ReturnsServiceUnavailable()
        {
            // Arrange
            var caseId = "case-data-down";
            var serviceMock = new Mock<IResolutionSuggestionService>();

            serviceMock
                .Setup(s => s.GetPrioritizedResolutionsAsync(caseId))
                .ThrowsAsync(new ResolutionDataUnavailableException());

            var controller = new ResolutionsController(serviceMock.Object);

            // Act
            var result = await controller.GetPrioritizedResolutions(caseId);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(503, statusResult.StatusCode);
            Assert.Equal("Resolution suggestions are temporarily unavailable.", statusResult.Value);
        }
    }
}
