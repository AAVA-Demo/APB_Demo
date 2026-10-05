using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class IssueContextSummaryControllerTests
    {
        [Fact]
        public void GetIssueContextSummary_ValidCaseId_ReturnsOkWithResponse()
        {
            // Arrange
            var serviceMock = new Mock<IIssueContextSummaryService>();
            var response = new IssueContextSummaryResponseDto();
            serviceMock.Setup(s => s.GetSummary("case-1")).Returns(response);
            var controller = new IssueContextSummaryController(serviceMock.Object);

            // Act
            var result = controller.GetIssueContextSummary("case-1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            serviceMock.Verify(s => s.GetSummary("case-1"), Times.Once);
        }

        [Fact]
        public void GetIssueContextSummary_BlankCaseId_ReturnsBadRequest()
        {
            // Arrange
            var serviceMock = new Mock<IIssueContextSummaryService>();
            var controller = new IssueContextSummaryController(serviceMock.Object);

            // Act
            var result = controller.GetIssueContextSummary(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("caseId must not be blank", badRequestResult.Value);
            serviceMock.Verify(s => s.GetSummary(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void GetIssueContextSummary_NoResponse_ReturnsNotFound()
        {
            // Arrange
            var serviceMock = new Mock<IIssueContextSummaryService>();
            serviceMock.Setup(s => s.GetSummary("case-1")).Returns((IssueContextSummaryResponseDto?)null);
            var controller = new IssueContextSummaryController(serviceMock.Object);

            // Act
            var result = controller.GetIssueContextSummary("case-1");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            serviceMock.Verify(s => s.GetSummary("case-1"), Times.Once);
        }
    }
}
