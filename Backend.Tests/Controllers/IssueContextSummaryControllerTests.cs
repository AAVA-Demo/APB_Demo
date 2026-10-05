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
    public class IssueContextSummaryControllerTests
    {
        private readonly Mock<IIssueContextSummaryService> _serviceMock;
        private readonly IssueContextSummaryController _controller;

        public IssueContextSummaryControllerTests()
        {
            _serviceMock = new Mock<IIssueContextSummaryService>();
            _controller = new IssueContextSummaryController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetIssueContextSummary_ValidIds_ReturnsOkWithResult()
        {
            var caseId = "case-1";
            var memberId = "member-1";
            var expected = new IssueContextSummaryDto();
            _serviceMock.Setup(s => s.GetIssueContextSummaryAsync(caseId, memberId))
                .ReturnsAsync(expected);

            var result = await _controller.GetIssueContextSummary(caseId, memberId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.GetIssueContextSummaryAsync(caseId, memberId), Times.Once);
        }

        [Fact]
        public async Task GetIssueContextSummary_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var caseId = "case-2";
            var memberId = "member-2";
            _serviceMock.Setup(s => s.GetIssueContextSummaryAsync(caseId, memberId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.GetIssueContextSummary(caseId, memberId);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.GetIssueContextSummaryAsync(caseId, memberId), Times.Once);
        }

        [Fact]
        public async Task BuildIssueContextSummary_ValidRequest_ReturnsOkWithResult()
        {
            var request = new IssueContextSummaryBuildRequestDto { CaseId = "case-3", MemberId = "member-3" };
            var expected = new IssueContextSummaryDto();
            _serviceMock.Setup(s => s.BuildIssueContextSummaryAsync(request.CaseId, request.MemberId))
                .ReturnsAsync(expected);

            var result = await _controller.BuildIssueContextSummary(request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.BuildIssueContextSummaryAsync(request.CaseId, request.MemberId), Times.Once);
        }

        [Fact]
        public async Task BuildIssueContextSummary_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var request = new IssueContextSummaryBuildRequestDto { CaseId = "case-4", MemberId = "member-4" };
            _serviceMock.Setup(s => s.BuildIssueContextSummaryAsync(request.CaseId, request.MemberId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.BuildIssueContextSummary(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.BuildIssueContextSummaryAsync(request.CaseId, request.MemberId), Times.Once);
        }
    }
}
