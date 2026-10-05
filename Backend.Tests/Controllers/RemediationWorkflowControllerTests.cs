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
        public async Task GetWorkflow_ValidIssueIdWithWorkflow_ReturnsOkWithWorkflow()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var workflow = new WorkflowDto();
            _serviceMock.Setup(s => s.GetWorkflowAsync(issueId)).ReturnsAsync(workflow);

            // Act
            var result = await _controller.GetWorkflow(issueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(workflow, okResult.Value);
            _serviceMock.Verify(s => s.GetWorkflowAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetWorkflow_WorkflowNotFound_ReturnsNotFound()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _serviceMock.Setup(s => s.GetWorkflowAsync(issueId)).ReturnsAsync((WorkflowDto)null);

            // Act
            var result = await _controller.GetWorkflow(issueId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _serviceMock.Verify(s => s.GetWorkflowAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetWorkflow_InvalidIssueId_ReturnsBadRequest()
        {
            // Arrange
            var issueId = Guid.Empty;

            // Act
            var result = await _controller.GetWorkflow(issueId);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid issueId.", badRequest.Value);
            _serviceMock.Verify(s => s.GetWorkflowAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task CompleteStep_ValidRequestWithValidOrder_ReturnsOkWithWorkflow()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var stepId = Guid.NewGuid();
            var request = new StepCompletionRequestDto { StepId = stepId, IsCompleted = true };
            var workflowDto = new WorkflowDto();
            var resultDto = new StepCompletionResultDto { Workflow = workflowDto, IsOrderValid = true };
            _serviceMock.Setup(s => s.CompleteStepAsync(issueId, stepId, request.IsCompleted)).ReturnsAsync(resultDto);

            // Act
            var result = await _controller.CompleteStep(issueId, stepId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(workflowDto, okResult.Value);
            _serviceMock.Verify(s => s.CompleteStepAsync(issueId, stepId, request.IsCompleted), Times.Once);
        }

        [Fact]
        public async Task CompleteStep_InvalidRequest_ReturnsBadRequest()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var stepId = Guid.NewGuid();
            var request = new StepCompletionRequestDto { StepId = Guid.Empty, IsCompleted = true };

            // Act
            var result = await _controller.CompleteStep(issueId, stepId, request);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid request.", badRequest.Value);
            _serviceMock.Verify(s => s.CompleteStepAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<bool>()), Times.Never);
        }
    }
}
