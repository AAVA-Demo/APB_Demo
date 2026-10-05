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
    public class RemediationGuidanceControllerTests
    {
        private readonly Mock<IRemediationGuidanceService> _serviceMock;
        private readonly RemediationGuidanceController _controller;

        public RemediationGuidanceControllerTests()
        {
            _serviceMock = new Mock<IRemediationGuidanceService>();
            _controller = new RemediationGuidanceController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRemediationSteps_ValidCaseId_ReturnsOkWithResult()
        {
            var caseId = "case-1";
            var expected = new RemediationStepsResponseDto();
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(caseId))
                .ReturnsAsync(expected);

            var result = await _controller.GetRemediationSteps(caseId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(caseId), Times.Once);
        }

        [Fact]
        public async Task GetRemediationSteps_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var caseId = "case-2";
            _serviceMock.Setup(s => s.GetRemediationStepsAsync(caseId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.GetRemediationSteps(caseId);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.GetRemediationStepsAsync(caseId), Times.Once);
        }

        [Fact]
        public async Task BuildRemediationSteps_ValidRequest_ReturnsOkWithResult()
        {
            var request = new RemediationStepsBuildRequestDto { CaseId = "case-3" };
            var expected = new RemediationStepsResponseDto();
            _serviceMock.Setup(s => s.BuildRemediationStepsAsync(request.CaseId))
                .ReturnsAsync(expected);

            var result = await _controller.BuildRemediationSteps(request);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expected, okResult.Value);
            _serviceMock.Verify(s => s.BuildRemediationStepsAsync(request.CaseId), Times.Once);
        }

        [Fact]
        public async Task BuildRemediationSteps_ServiceThrowsInvalidOperation_ReturnsBadRequest()
        {
            var request = new RemediationStepsBuildRequestDto { CaseId = "case-4" };
            _serviceMock.Setup(s => s.BuildRemediationStepsAsync(request.CaseId))
                .ThrowsAsync(new InvalidOperationException("error"));

            var result = await _controller.BuildRemediationSteps(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            _serviceMock.Verify(s => s.BuildRemediationStepsAsync(request.CaseId), Times.Once);
        }
    }
}
