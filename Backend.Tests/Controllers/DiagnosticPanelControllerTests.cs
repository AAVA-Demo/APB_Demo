using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class DiagnosticPanelControllerTests
    {
        [Fact]
        public void GetDiagnosticPanelData_ValidCaseIdAndMemberId_ReturnsOkWithResponse()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            var expectedResponse = new DiagnosticPanelResponseDto();
            serviceMock.Setup(s => s.GetPanelData("case-1", "member-1")).Returns(expectedResponse);
            var controller = new DiagnosticPanelController(serviceMock.Object);

            // Act
            var result = controller.GetDiagnosticPanelData("case-1", "member-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            serviceMock.Verify(s => s.GetPanelData("case-1", "member-1"), Times.Once);
        }

        [Fact]
        public void GetDiagnosticPanelData_BlankCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            var controller = new DiagnosticPanelController(serviceMock.Object);

            // Act
            var result = controller.GetDiagnosticPanelData(" ", null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("caseId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.GetPanelData(It.IsAny<string>(), It.IsAny<string?>()), Times.Never);
        }

        [Fact]
        public void GetDiagnosticPanelData_MemberIdTooLong_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            var controller = new DiagnosticPanelController(serviceMock.Object);
            var longMemberId = new string('a', 65);

            // Act
            var result = controller.GetDiagnosticPanelData("case-1", longMemberId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("memberId length must be <= 64", badRequestResult.Value);
            serviceMock.Verify(s => s.GetPanelData(It.IsAny<string>(), It.IsAny<string?>()), Times.Never);
        }

        [Fact]
        public void GetDiagnosticPanelData_NoResponse_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IDiagnosticInsightService>();
            serviceMock.Setup(s => s.GetPanelData("case-1", null)).Returns((DiagnosticPanelResponseDto?)null);
            var controller = new DiagnosticPanelController(serviceMock.Object);

            // Act
            var result = controller.GetDiagnosticPanelData("case-1", null);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetPanelData("case-1", null), Times.Once);
        }
    }
}
