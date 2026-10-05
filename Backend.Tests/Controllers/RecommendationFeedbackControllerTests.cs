using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RecommendationFeedbackControllerTests
    {
        [Fact]
        public void SubmitFeedback_ValidInput_ReturnsOkWithResponse()
        {
            // Arrange
            var serviceMock = new Mock<IRecommendationFeedbackService>();
            var request = new RecommendationFeedbackRequestDto();
            var response = new RecommendationFeedbackResponseDto();
            serviceMock.Setup(s => s.SubmitFeedback("rec-1", request)).Returns(response);
            var controller = new RecommendationFeedbackController(serviceMock.Object);

            // Act
            var result = controller.SubmitFeedback("rec-1", request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            serviceMock.Verify(s => s.SubmitFeedback("rec-1", request), Times.Once);
        }

        [Fact]
        public void SubmitFeedback_BlankRecommendationId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IRecommendationFeedbackService>();
            var controller = new RecommendationFeedbackController(serviceMock.Object);
            var request = new RecommendationFeedbackRequestDto();

            // Act
            var result = controller.SubmitFeedback(" ", request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("recommendationId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.SubmitFeedback(It.IsAny<string>(), It.IsAny<RecommendationFeedbackRequestDto>()), Times.Never);
        }

        [Fact]
        public void SubmitFeedback_InvalidModelState_ReturnsBadRequestWithModelState()
        {
            // Arrange
            var serviceMock = new Mock<IRecommendationFeedbackService>();
            var controller = new RecommendationFeedbackController(serviceMock.Object);
            controller.ModelState.AddModelError("field", "error");
            var request = new RecommendationFeedbackRequestDto();

            // Act
            var result = controller.SubmitFeedback("rec-1", request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Same(controller.ModelState, badRequestResult.Value);
            serviceMock.Verify(s => s.SubmitFeedback(It.IsAny<string>(), It.IsAny<RecommendationFeedbackRequestDto>()), Times.Never);
        }
    }
}
