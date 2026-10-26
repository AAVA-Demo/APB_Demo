using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class DiagnosticOutcomeControllerTests
    {
        [Fact]
        public async Task RecordResolutionOutcome_ValidRequest_ReturnsOkWithDto()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightOutcomeService>();
            var expectedDto = new RecordResolutionOutcomeResponse();
            serviceMock
                .Setup(s => s.RecordResolutionOutcome("case-1", "insight-1", true, "comment", "user"))
                .ReturnsAsync(expectedDto);
            var controller = new DiagnosticOutcomeController(serviceMock.Object);
            var request = new RecordResolutionOutcomeRequest
            {
                IsResolved = true,
                Comment = "comment",
                RecordedBy = "user"
            };

            // Act
            var result = await controller.RecordResolutionOutcome("case-1", "insight-1", request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.RecordResolutionOutcome("case-1", "insight-1", true, "comment", "user"), Times.Once);
        }

        [Fact]
        public async Task RecordResolutionOutcome_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightOutcomeService>();
            var controller = new DiagnosticOutcomeController(serviceMock.Object);
            controller.ModelState.AddModelError("IsResolved", "Required");
            var request = new RecordResolutionOutcomeRequest();

            // Act
            var result = await controller.RecordResolutionOutcome("case-1", "insight-1", request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Same(controller.ModelState, badRequestResult.Value);
            serviceMock.Verify(s => s.RecordResolutionOutcome(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task RecordResolutionOutcome_ValidationException_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightOutcomeService>();
            serviceMock
                .Setup(s => s.RecordResolutionOutcome("case-1", "insight-1", true, "comment", "user"))
                .ThrowsAsync(new ValidationException("invalid"));
            var controller = new DiagnosticOutcomeController(serviceMock.Object);
            var request = new RecordResolutionOutcomeRequest
            {
                IsResolved = true,
                Comment = "comment",
                RecordedBy = "user"
            };

            // Act
            var result = await controller.RecordResolutionOutcome("case-1", "insight-1", request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("invalid", badRequestResult.Value);
            serviceMock.Verify(s => s.RecordResolutionOutcome("case-1", "insight-1", true, "comment", "user"), Times.Once);
        }

        [Fact]
        public async Task RecordResolutionOutcome_CaseOrInsightNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightOutcomeService>();
            serviceMock
                .Setup(s => s.RecordResolutionOutcome("missing-case", "insight-1", true, "comment", "user"))
                .ThrowsAsync(new CaseNotFoundException());
            var controller = new DiagnosticOutcomeController(serviceMock.Object);
            var request = new RecordResolutionOutcomeRequest
            {
                IsResolved = true,
                Comment = "comment",
                RecordedBy = "user"
            };

            // Act
            var result = await controller.RecordResolutionOutcome("missing-case", "insight-1", request);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            serviceMock.Verify(s => s.RecordResolutionOutcome("missing-case", "insight-1", true, "comment", "user"), Times.Once);
        }

        [Fact]
        public async Task RecordResolutionOutcome_DuplicateOutcome_ReturnsConflict()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightOutcomeService>();
            serviceMock
                .Setup(s => s.RecordResolutionOutcome("case-1", "insight-1", true, "comment", "user"))
                .ThrowsAsync(new DuplicateOutcomeException());
            var controller = new DiagnosticOutcomeController(serviceMock.Object);
            var request = new RecordResolutionOutcomeRequest
            {
                IsResolved = true,
                Comment = "comment",
                RecordedBy = "user"
            };

            // Act
            var result = await controller.RecordResolutionOutcome("case-1", "insight-1", request);

            // Assert
            Assert.IsType<ConflictResult>(result);
            serviceMock.Verify(s => s.RecordResolutionOutcome("case-1", "insight-1", true, "comment", "user"), Times.Once);
        }
    }
}
