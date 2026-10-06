using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RemediationGuidanceControllerTests
    {
        private readonly Mock<IRemediationGuidanceService> _remediationGuidanceServiceMock;
        private readonly Mock<IAuthenticationContextProvider> _authenticationContextProviderMock;
        private readonly RemediationGuidanceController _controller;

        public RemediationGuidanceControllerTests()
        {
            _remediationGuidanceServiceMock = new Mock<IRemediationGuidanceService>();
            _authenticationContextProviderMock = new Mock<IAuthenticationContextProvider>();
            _controller = new RemediationGuidanceController(_remediationGuidanceServiceMock.Object, _authenticationContextProviderMock.Object);
        }

        [Fact]
        public async Task GetRemediationGuidance_ValidInput_ReturnsOkWithDto()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var expectedDto = new RemediationGuidanceDto();
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _remediationGuidanceServiceMock.Setup(s => s.GetGuidance(memberIssueId, agentId)).ReturnsAsync(expectedDto);

            // Act
            var result = await _controller.GetRemediationGuidance(memberIssueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            _remediationGuidanceServiceMock.Verify(s => s.GetGuidance(memberIssueId, agentId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationGuidance_MissingMemberIssueId_ReturnsBadRequest()
        {
            // Arrange

            // Act
            var result = await _controller.GetRemediationGuidance(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Member issue identifier is required.", badRequestResult.Value);
            _remediationGuidanceServiceMock.Verify(s => s.GetGuidance(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRemediationGuidance_MissingAgentId_ReturnsUnauthorized()
        {
            // Arrange
            var memberIssueId = "issue-123";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(string.Empty);

            // Act
            var result = await _controller.GetRemediationGuidance(memberIssueId);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Authenticated agent is required.", unauthorizedResult.Value);
            _remediationGuidanceServiceMock.Verify(s => s.GetGuidance(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRemediationGuidance_GuidanceNotAvailable_ReturnsNotFound()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var exceptionMessage = "Guidance not available.";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _remediationGuidanceServiceMock.Setup(s => s.GetGuidance(memberIssueId, agentId))
                .ThrowsAsync(new RemediationGuidanceNotAvailableException(exceptionMessage));

            // Act
            var result = await _controller.GetRemediationGuidance(memberIssueId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(exceptionMessage, notFoundResult.Value);
        }
    }
}
