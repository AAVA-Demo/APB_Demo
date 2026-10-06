using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RemediationInstructionsControllerTests
    {
        private readonly Mock<IRemediationInstructionsService> _serviceMock;
        private readonly RemediationInstructionsController _controller;

        public RemediationInstructionsControllerTests()
        {
            _serviceMock = new Mock<IRemediationInstructionsService>();
            _controller = new RemediationInstructionsController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRemediationInstructionsForIssue_ValidIssueId_ReturnsOkWithResult()
        {
            // Arrange
            var issueId = "issue-123";
            var expectedResponse = new RemediationInstructionsResponseDto();
            _serviceMock.Setup(s => s.GetInstructions(issueId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetRemediationInstructionsForIssue(issueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetInstructions(issueId), Times.Once);
        }

        [Fact]
        public async Task RefreshRemediationInstructions_ValidRequest_ReturnsOkWithResult()
        {
            // Arrange
            var issueId = "issue-123";
            var request = new RefreshRemediationInstructionsRequestDto { IssueId = issueId };
            var expectedResponse = new RemediationInstructionsRefreshStatusDto();
            _serviceMock.Setup(s => s.RefreshInstructions(issueId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.RefreshRemediationInstructions(issueId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.RefreshInstructions(issueId), Times.Once);
        }

        [Fact]
        public async Task RefreshRemediationInstructions_IssueIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var issueId = "issue-123";
            var request = new RefreshRemediationInstructionsRequestDto { IssueId = "different" };

            // Act
            var result = await _controller.RefreshRemediationInstructions(issueId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.RefreshInstructions(It.IsAny<string>()), Times.Never);
        }
    }
}
