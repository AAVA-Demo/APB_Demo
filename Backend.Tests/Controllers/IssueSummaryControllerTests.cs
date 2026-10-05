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
    public class IssueSummaryControllerTests
    {
        private readonly Mock<IIssueSummaryService> _serviceMock;
        private readonly IssueSummaryController _controller;

        public IssueSummaryControllerTests()
        {
            _serviceMock = new Mock<IIssueSummaryService>();
            _controller = new IssueSummaryController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetIssueSummary_ValidIds_ReturnsOkWithResult()
        {
            var memberId = "member-1";
            var issueId = "issue-1";
            var response = new IssueSummaryResponse();
            _serviceMock.Setup(s => s.GetIssueSummaryAsync(memberId, issueId))
                .ReturnsAsync(response);

            var result = await _controller.GetIssueSummary(memberId, issueId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetIssueSummaryAsync(memberId, issueId), Times.Once);
        }

        [Fact]
        public async Task GetIssueSummary_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var memberId = "member-1";
            var issueId = "issue-bad";
            _serviceMock.Setup(s => s.GetIssueSummaryAsync(memberId, issueId))
                .ThrowsAsync(new ArgumentException("invalid"));

            var result = await _controller.GetIssueSummary(memberId, issueId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetIssueSummaryAsync(memberId, issueId), Times.Once);
        }
    }
}
