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
    public class RemediationStepTrackingControllerTests
    {
        private readonly Mock<IRemediationStepTrackingService> _serviceMock;
        private readonly RemediationStepTrackingController _controller;

        public RemediationStepTrackingControllerTests()
        {
            _serviceMock = new Mock<IRemediationStepTrackingService>();
            _controller = new RemediationStepTrackingController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRemediationSteps_ValidIssueId_ReturnsOkWithResult()
        {
            var issueId = "issue-1";
            var response = new RemediationStepListResponse();
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(issueId))
                .ReturnsAsync(response);

            var result = await _controller.GetRemediationSteps(issueId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var issueId = "bad-issue";
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(issueId))
                .ThrowsAsync(new ArgumentException("invalid"));

            var result = await _controller.GetRemediationSteps(issueId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task CompleteRemediationStep_InvalidModelState_ReturnsBadRequest()
        {
            var issueId = "issue-1";
            var stepId = "step-1";
            var request = new RemediationStepCompleteRequest();
            _controller.ModelState.AddModelError("field", "error");

            var result = await _controller.CompleteRemediationStep(issueId, stepId, request);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.CompleteRemediationStepAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<RemediationStepCompleteRequest>()), Times.Never);
        }

        [Fact]
        public async Task CompleteRemediationStep_ValidRequest_ReturnsOkWithResult()
        {
            var issueId = "issue-1";
            var stepId = "step-1";
            var request = new RemediationStepCompleteRequest();
            var response = new RemediationStepUpdateResponse();
            _serviceMock.Setup(s => s.CompleteRemediationStepAsync(issueId, stepId, request))
                .ReturnsAsync(response);

            var result = await _controller.CompleteRemediationStep(issueId, stepId, request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.CompleteRemediationStepAsync(issueId, stepId, request), Times.Once);
        }

        [Fact]
        public async Task CompleteRemediationStep_ServiceThrowsInvalidOperationException_ReturnsNotFound()
        {
            var issueId = "issue-1";
            var stepId = "missing-step";
            var request = new RemediationStepCompleteRequest();
            _serviceMock.Setup(s => s.CompleteRemediationStepAsync(issueId, stepId, request))
                .ThrowsAsync(new InvalidOperationException());

            var result = await _controller.CompleteRemediationStep(issueId, stepId, request);

            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.CompleteRemediationStepAsync(issueId, stepId, request), Times.Once);
        }
    }
}
