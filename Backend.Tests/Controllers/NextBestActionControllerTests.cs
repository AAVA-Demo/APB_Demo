using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class NextBestActionControllerTests
    {
        private readonly Mock<INextBestActionService> _nextBestActionServiceMock;
        private readonly Mock<IAuthenticationContextProvider> _authenticationContextProviderMock;
        private readonly NextBestActionController _controller;

        public NextBestActionControllerTests()
        {
            _nextBestActionServiceMock = new Mock<INextBestActionService>();
            _authenticationContextProviderMock = new Mock<IAuthenticationContextProvider>();
            _controller = new NextBestActionController(_nextBestActionServiceMock.Object, _authenticationContextProviderMock.Object);
        }

        [Fact]
        public async Task GetNextBestActionPrompt_ValidInput_ReturnsOkWithDto()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var expectedDto = new NextBestActionPromptDto();
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _nextBestActionServiceMock.Setup(s => s.GetPrompt(memberIssueId, agentId)).ReturnsAsync(expectedDto);

            // Act
            var result = await _controller.GetNextBestActionPrompt(memberIssueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            _nextBestActionServiceMock.Verify(s => s.GetPrompt(memberIssueId, agentId), Times.Once);
        }

        [Fact]
        public async Task GetNextBestActionPrompt_MissingMemberIssueId_ReturnsBadRequest()
        {
            // Arrange

            // Act
            var result = await _controller.GetNextBestActionPrompt(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Member issue identifier is required.", badRequestResult.Value);
            _nextBestActionServiceMock.Verify(s => s.GetPrompt(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetNextBestActionPrompt_MissingAgentId_ReturnsUnauthorized()
        {
            // Arrange
            var memberIssueId = "issue-123";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(string.Empty);

            // Act
            var result = await _controller.GetNextBestActionPrompt(memberIssueId);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Authenticated agent is required.", unauthorizedResult.Value);
            _nextBestActionServiceMock.Verify(s => s.GetPrompt(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetNextBestActionPrompt_RecommendationNotAvailable_ReturnsNotFound()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var exceptionMessage = "Recommendation not available.";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _nextBestActionServiceMock.Setup(s => s.GetPrompt(memberIssueId, agentId))
                .ThrowsAsync(new RecommendationNotAvailableException(exceptionMessage));

            // Act
            var result = await _controller.GetNextBestActionPrompt(memberIssueId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(exceptionMessage, notFoundResult.Value);
        }
    }
}
