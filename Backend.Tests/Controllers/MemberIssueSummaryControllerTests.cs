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
    public class MemberIssueSummaryControllerTests
    {
        private readonly Mock<IMemberIssueSummaryService> _serviceMock;
        private readonly MemberIssueSummaryController _controller;

        public MemberIssueSummaryControllerTests()
        {
            _serviceMock = new Mock<IMemberIssueSummaryService>();
            _controller = new MemberIssueSummaryController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetIssueSummary_ValidMemberId_ReturnsOkWithSummary()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var summary = new MemberIssueSummaryDto();
            _serviceMock
                .Setup(s => s.GetMemberIssueSummaryAsync(memberId))
                .ReturnsAsync(summary);

            // Act
            var result = await _controller.GetIssueSummary(memberId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(summary, okResult.Value);
            _serviceMock.Verify(s => s.GetMemberIssueSummaryAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetIssueSummary_EmptyMemberId_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;

            // Act
            var result = await _controller.GetIssueSummary(memberId);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            _serviceMock.Verify(s => s.GetMemberIssueSummaryAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task GetIssueSummary_NoSummary_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            _serviceMock
                .Setup(s => s.GetMemberIssueSummaryAsync(memberId))
                .ReturnsAsync((MemberIssueSummaryDto)null);

            // Act
            var result = await _controller.GetIssueSummary(memberId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.GetMemberIssueSummaryAsync(memberId), Times.Once);
        }
    }
}
