using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class ContextAwareIssueControllerTests
    {
        private readonly Mock<IContextAwareIssueService> _serviceMock;
        private readonly ContextAwareIssueController _controller;

        public ContextAwareIssueControllerTests()
        {
            _serviceMock = new Mock<IContextAwareIssueService>();
            _controller = new ContextAwareIssueController(_serviceMock.Object);
        }

        [Fact]
        public async Task AnalyzeMemberCaseWithContext_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var request = new AnalyzeCaseRequestDto { CaseId = caseId };
            var expectedResponse = new ContextAwareIssueAnalysisResponseDto();
            _serviceMock.Setup(s => s.AnalyzeCase(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.AnalyzeMemberCaseWithContext(caseId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.AnalyzeCase(caseId), Times.Once);
        }

        [Fact]
        public async Task AnalyzeMemberCaseWithContext_CaseIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var caseId = "case-123";
            var request = new AnalyzeCaseRequestDto { CaseId = "different" };

            // Act
            var result = await _controller.AnalyzeMemberCaseWithContext(caseId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.AnalyzeCase(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task AnalyzeMemberCaseWithContext_NullCaseId_ReturnsBadRequest()
        {
            // Arrange
            string caseId = null;
            var request = new AnalyzeCaseRequestDto { CaseId = "case-123" };

            // Act
            var result = await _controller.AnalyzeMemberCaseWithContext(caseId, request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _serviceMock.Verify(s => s.AnalyzeCase(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetContextAwareIssuesForCase_ValidCaseId_ReturnsOkWithResult()
        {
            // Arrange
            var caseId = "case-123";
            var expectedResponse = new ContextAwareIssuesResponseDto();
            _serviceMock.Setup(s => s.GetIssues(caseId)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetContextAwareIssuesForCase(caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedResponse, okResult.Value);
            _serviceMock.Verify(s => s.GetIssues(caseId), Times.Once);
        }
    }
}
