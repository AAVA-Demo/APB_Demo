using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class RemediationWorkflowControllerTests
    {
        private readonly Mock<IRemediationWorkflowService> _serviceMock;
        private readonly RemediationWorkflowController _controller;

        public RemediationWorkflowControllerTests()
        {
            _serviceMock = new Mock<IRemediationWorkflowService>();
            _controller = new RemediationWorkflowController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetRemediationWorkflowForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new RemediationWorkflowResponseDto();
            _serviceMock.Setup(s => s.GetWorkflow(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetRemediationWorkflowForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetWorkflow(caseId), Times.Once);
        }

        [Fact]
        public async Task StartRemediationWorkflowForIssue_ValidRequest_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var issueId = "issue-123";
            var request = new StartRemediationWorkflowRequestDto { CaseId = caseId, IssueId = issueId };
            var expectedResponse = new RemediationWorkflowStartResponseDto();
            _serviceMock.Setup(s => s.StartWorkflow(caseId, issueId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.StartRemediationWorkflowForIssue(caseId, issueId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.StartWorkflow(caseId, issueId), Times.Once);
        }

        [Fact]
        public async Task StartRemediationWorkflowForIssue_CaseIdOrIssueIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var caseId = "case-123";
            var issueId = "issue-123";
            var request = new StartRemediationWorkflowRequestDto { CaseId = "different", IssueId = issueId };

            // Act
            var result = await _controller.StartRemediationWorkflowForIssue(caseId, issueId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.StartWorkflow(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task UpdateRemediationStepStatus_ValidRequest_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var stepInstanceId = "step-123";
            var request = new UpdateRemediationStepStatusRequestDto { Status = "Completed" };
            var expectedResponse = new RemediationStepStatusDto();
            _serviceMock.Setup(s => s.UpdateStepStatus(caseId, stepInstanceId, request.Status)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.UpdateRemediationStepStatus(caseId, stepInstanceId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.UpdateStepStatus(caseId, stepInstanceId, request.Status), Times.Once);
        }

        [Fact]
        public async Task UpdateRemediationStepStatus_EmptyStepInstanceId_ReturnsBadRequest()
        {
            // Arrange
            var caseId = "case-123";
            var stepInstanceId = "";
            var request = new UpdateRemediationStepStatusRequestDto { Status = "Completed" };

            // Act
            var result = await _controller.UpdateRemediationStepStatus(caseId, stepInstanceId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.UpdateStepStatus(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetRemediationWorkflowStatusForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new RemediationWorkflowStatusDto();
            _serviceMock.Setup(s => s.GetWorkflowStatus(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetRemediationWorkflowStatusForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetWorkflowStatus(caseId), Times.Once);
        }
    }
}
