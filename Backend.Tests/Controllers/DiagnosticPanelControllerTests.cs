using System.Threading.Tasks;
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
        private readonly Mock<IDiagnosticPanelService> _diagnosticPanelServiceMock;
        private readonly Mock<IWorkspaceContextService> _workspaceContextServiceMock;
        private readonly Mock<IAuthenticationContextProvider> _authenticationContextProviderMock;
        private readonly DiagnosticPanelController _controller;

        public DiagnosticPanelControllerTests()
        {
            _diagnosticPanelServiceMock = new Mock<IDiagnosticPanelService>();
            _workspaceContextServiceMock = new Mock<IWorkspaceContextService>();
            _authenticationContextProviderMock = new Mock<IAuthenticationContextProvider>();
            _controller = new DiagnosticPanelController(_diagnosticPanelServiceMock.Object, _workspaceContextServiceMock.Object, _authenticationContextProviderMock.Object);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_UsesWorkspaceWhenMemberIssueIdMissing_ReturnsOkWithDto()
        {
            // Arrange
            var memberIssueIdFromWorkspace = "issue-workspace";
            var agentId = "agent-1";
            var expectedDto = new DiagnosticPanelContextDto();
            _workspaceContextServiceMock.Setup(s => s.GetCurrentMemberIssueId()).Returns(memberIssueIdFromWorkspace);
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _diagnosticPanelServiceMock.Setup(s => s.GetPanelContext(memberIssueIdFromWorkspace, agentId)).ReturnsAsync(expectedDto);

            // Act
            var result = await _controller.GetDiagnosticPanelContext(null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            _diagnosticPanelServiceMock.Verify(s => s.GetPanelContext(memberIssueIdFromWorkspace, agentId), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_NoMemberIssueIdAnywhere_ReturnsBadRequest()
        {
            // Arrange
            _workspaceContextServiceMock.Setup(s => s.GetCurrentMemberIssueId()).Returns(string.Empty);

            // Act
            var result = await _controller.GetDiagnosticPanelContext(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Member issue identifier is required.", badRequestResult.Value);
            _diagnosticPanelServiceMock.Verify(s => s.GetPanelContext(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_MissingAgentId_ReturnsUnauthorized()
        {
            // Arrange
            var memberIssueId = "issue-123";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(string.Empty);

            // Act
            var result = await _controller.GetDiagnosticPanelContext(memberIssueId);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Authenticated agent is required.", unauthorizedResult.Value);
            _diagnosticPanelServiceMock.Verify(s => s.GetPanelContext(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_PanelUnavailable_ReturnsNotFound()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var exceptionMessage = "Panel unavailable.";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _diagnosticPanelServiceMock.Setup(s => s.GetPanelContext(memberIssueId, agentId))
                .ThrowsAsync(new PanelUnavailableException(exceptionMessage));

            // Act
            var result = await _controller.GetDiagnosticPanelContext(memberIssueId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(exceptionMessage, notFoundResult.Value);
        }
    }
}
