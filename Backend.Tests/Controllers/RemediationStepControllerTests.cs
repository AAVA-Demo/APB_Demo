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
    public class RemediationStepControllerTests
    {
        private readonly Mock<IRemediationStepService> _serviceMock;
        private readonly RemediationStepController _controller;

        public RemediationStepControllerTests()
        {
            _serviceMock = new Mock<IRemediationStepService>();
            _controller = new RemediationStepController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRemediationSteps_ValidIds_ReturnsOkWithResult()
        {
            var memberId = "member-1";
            var issueId = "issue-1";
            var response = new RemediationStepResponse();
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(memberId, issueId))
                .ReturnsAsync(response);

            var result = await _controller.GetRemediationSteps(memberId, issueId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(memberId, issueId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var memberId = "member-1";
            var issueId = "issue-bad";
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(memberId, issueId))
                .ThrowsAsync(new System.ArgumentException("invalid"));

            var result = await _controller.GetRemediationSteps(memberId, issueId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(memberId, issueId), Times.Once);
        }
    }
}
