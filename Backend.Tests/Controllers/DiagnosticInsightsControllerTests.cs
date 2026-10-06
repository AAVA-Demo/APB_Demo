using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class DiagnosticInsightsControllerTests
    {
        private readonly Mock<IDiagnosticInsightsService> _diagnosticInsightsServiceMock;
        private readonly Mock<IAuthenticationContextProvider> _authenticationContextProviderMock;
        private readonly DiagnosticInsightsController _controller;

        public DiagnosticInsightsControllerTests()
        {
            _diagnosticInsightsServiceMock = new Mock<IDiagnosticInsightsService>();
            _authenticationContextProviderMock = new Mock<IAuthenticationContextProvider>();
            _controller = new DiagnosticInsightsController(_diagnosticInsightsServiceMock.Object, _authenticationContextProviderMock.Object);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_ValidInput_ReturnsOkWithDto()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var expectedDto = new DiagnosticInsightsDto();
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _diagnosticInsightsServiceMock.Setup(s => s.GetInsights(memberIssueId, agentId)).ReturnsAsync(expectedDto);

            // Act
            var result = await _controller.GetRealTimeDiagnosticInsights(memberIssueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            _diagnosticInsightsServiceMock.Verify(s => s.GetInsights(memberIssueId, agentId), Times.Once);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_MissingMemberIssueId_ReturnsBadRequest()
        {
            // Arrange

            // Act
            var result = await _controller.GetRealTimeDiagnosticInsights(" ");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Member issue identifier is required.", badRequestResult.Value);
            _diagnosticInsightsServiceMock.Verify(s => s.GetInsights(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_MissingAgentId_ReturnsUnauthorized()
        {
            // Arrange
            var memberIssueId = "issue-123";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(string.Empty);

            // Act
            var result = await _controller.GetRealTimeDiagnosticInsights(memberIssueId);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Authenticated agent is required.", unauthorizedResult.Value);
            _diagnosticInsightsServiceMock.Verify(s => s.GetInsights(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRealTimeDiagnosticInsights_InsightsNotAvailable_ReturnsNotFound()
        {
            // Arrange
            var memberIssueId = "issue-123";
            var agentId = "agent-1";
            var exceptionMessage = "Insights not available.";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(agentId);
            _diagnosticInsightsServiceMock.Setup(s => s.GetInsights(memberIssueId, agentId))
                .ThrowsAsync(new DiagnosticInsightsNotAvailableException(exceptionMessage));

            // Act
            var result = await _controller.GetRealTimeDiagnosticInsights(memberIssueId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(exceptionMessage, notFoundResult.Value);
        }
    }
}
