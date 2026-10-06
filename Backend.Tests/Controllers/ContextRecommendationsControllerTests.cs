using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class ContextRecommendationsControllerTests
    {
        private readonly Mock<IContextAwareRecommendationService> _recommendationServiceMock;
        private readonly Mock<IAuthenticationContextProvider> _authenticationContextProviderMock;
        private readonly ContextRecommendationsController _controller;

        public ContextRecommendationsControllerTests()
        {
            _recommendationServiceMock = new Mock<IContextAwareRecommendationService>();
            _authenticationContextProviderMock = new Mock<IAuthenticationContextProvider>();
            _controller = new ContextRecommendationsController(_recommendationServiceMock.Object, _authenticationContextProviderMock.Object);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_ValidInput_ReturnsOkWithDto()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var expectedDto = new ContextRecommendationsDto();
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _recommendationServiceMock.Setup(s => s.GetRecommendations(memberIssueId, agentId)).ReturnsAsync(expectedDto);

            // Act
            var result = await _controller.GetContextAwareRecommendations(memberIssueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            _recommendationServiceMock.Verify(s => s.GetRecommendations(memberIssueId, agentId), Times.Once);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_MissingMemberIssueId_ReturnsBadRequest()
        {
            // Arrange

            // Act
            var result = await _controller.GetContextAwareRecommendations(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Member issue identifier is required.", badRequestResult.Value);
            _recommendationServiceMock.Verify(s => s.GetRecommendations(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_MissingAgentId_ReturnsUnauthorized()
        {
            // Arrange
            var memberIssueId = "issue-123";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(string.Empty);

            // Act
            var result = await _controller.GetContextAwareRecommendations(memberIssueId);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Authenticated agent is required.", unauthorizedResult.Value);
            _recommendationServiceMock.Verify(s => s.GetRecommendations(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetContextAwareRecommendations_MemberIssueNotFound_ReturnsNotFound()
        {
            // Arrange
            var memberIssueId = "missing-issue";
            var agentId = "agent-1";
            var exceptionMessage = "Member issue not found.";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _recommendationServiceMock.Setup(s => s.GetRecommendations(memberIssueId, agentId))
                .ThrowsAsync(new MemberIssueNotFoundException(exceptionMessage));

            // Act
            var result = await _controller.GetContextAwareRecommendations(memberIssueId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(exceptionMessage, notFoundResult.Value);
        }
    }
}
