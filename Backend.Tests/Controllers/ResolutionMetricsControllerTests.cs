using System;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class ResolutionMetricsControllerTests
    {
        private readonly Mock<IResolutionMetricsService> _resolutionMetricsServiceMock;
        private readonly Mock<IAuthenticationContextProvider> _authenticationContextProviderMock;
        private readonly ResolutionMetricsController _controller;

        public ResolutionMetricsControllerTests()
        {
            _resolutionMetricsServiceMock = new Mock<IResolutionMetricsService>();
            _authenticationContextProviderMock = new Mock<IAuthenticationContextProvider>();
            _controller = new ResolutionMetricsController(_resolutionMetricsServiceMock.Object, _authenticationContextProviderMock.Object);
        }

        [Fact]
        public async Task GetAiAssistedResolutionMetrics_ValidInputAndAuthorized_ReturnsOkWithDto()
        {
            // Arrange
            var fromDate = DateTime.UtcNow.AddDays(-7).ToString("O");
            var toDate = DateTime.UtcNow.ToString("O");
            var userId = "team-lead";
            var roles = new[] { "TeamLead" };
            var expectedDto = new AiAssistedResolutionMetricsDto();
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(userId);
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserRoles()).Returns(roles);
            _resolutionMetricsServiceMock
                .Setup(s => s.GetAiAssistedMetrics(It.IsAny<DateTime>(), It.IsAny<DateTime>(), userId))
                .ReturnsAsync(expectedDto);

            // Act
            var result = await _controller.GetAiAssistedResolutionMetrics(fromDate, toDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedDto, okResult.Value);
            _resolutionMetricsServiceMock.Verify(s => s.GetAiAssistedMetrics(It.IsAny<DateTime>(), It.IsAny<DateTime>(), userId), Times.Once);
        }

        [Fact]
        public async Task GetAiAssistedResolutionMetrics_InvalidFromDate_ReturnsBadRequest()
        {
            // Arrange
            var fromDate = "invalid";
            var toDate = DateTime.UtcNow.ToString("O");

            // Act
            var result = await _controller.GetAiAssistedResolutionMetrics(fromDate, toDate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("From date is required and must be valid.", badRequestResult.Value);
            _resolutionMetricsServiceMock.Verify(s => s.GetAiAssistedMetrics(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetAiAssistedResolutionMetrics_MissingTeamLeadRole_ReturnsForbid()
        {
            // Arrange
            var fromDate = DateTime.UtcNow.AddDays(-7).ToString("O");
            var toDate = DateTime.UtcNow.ToString("O");
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns("user-1");
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserRoles()).Returns(new[] { "Agent" });

            // Act
            var result = await _controller.GetAiAssistedResolutionMetrics(fromDate, toDate);

            // Assert
            var forbidResult = Assert.IsType<ForbidObjectResult>(result.Result);
            Assert.Equal("User is not authorized to view AI-assisted metrics.", forbidResult.Value);
            _resolutionMetricsServiceMock.Verify(s => s.GetAiAssistedMetrics(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetAiAssistedResolutionMetrics_MetricsNotAvailable_ReturnsNotFound()
        {
            // Arrange
            var fromDate = DateTime.UtcNow.AddDays(-7).ToString("O");
            var toDate = DateTime.UtcNow.ToString("O");
            var userId = "team-lead";
            var roles = new[] { "TeamLead" };
            var exceptionMessage = "Metrics not available.";
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserId()).Returns(userId);
            _authenticationContextProviderMock.Setup(p => p.GetCurrentUserRoles()).Returns(roles);
            _resolutionMetricsServiceMock
                .Setup(s => s.GetAiAssistedMetrics(It.IsAny<DateTime>(), It.IsAny<DateTime>(), userId))
                .ThrowsAsync(new MetricsNotAvailableException(exceptionMessage));

            // Act
            var result = await _controller.GetAiAssistedResolutionMetrics(fromDate, toDate);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(exceptionMessage, notFoundResult.Value);
        }
    }
}
