using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class DiagnosticInsightControllerTests
    {
        [Fact]
        public async Task GetDiagnosticInsights_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            var expectedDto = new DiagnosticInsightListDto();
            serviceMock
                .Setup(s => s.GetDiagnosticInsights("case-1"))
                .ReturnsAsync(expectedDto);
            var controller = new DiagnosticInsightController(serviceMock.Object);

            // Act
            var result = await controller.GetDiagnosticInsights("case-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            serviceMock.Verify(s => s.GetDiagnosticInsights("case-1"), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticInsights_InvalidCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            serviceMock
                .Setup(s => s.GetDiagnosticInsights("invalid"))
                .ThrowsAsync(new ValidationException("invalid"));
            var controller = new DiagnosticInsightController(serviceMock.Object);

            // Act
            var result = await controller.GetDiagnosticInsights("invalid");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("invalid", badRequestResult.Value);
            serviceMock.Verify(s => s.GetDiagnosticInsights("invalid"), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticInsights_CaseNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            serviceMock
                .Setup(s => s.GetDiagnosticInsights("missing"))
                .ThrowsAsync(new CaseNotFoundException());
            var controller = new DiagnosticInsightController(serviceMock.Object);

            // Act
            var result = await controller.GetDiagnosticInsights("missing");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetDiagnosticInsights("missing"), Times.Once);
        }
    }
}
