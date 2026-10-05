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
    public class MemberContextControllerTests
    {
        private readonly Mock<IMemberContextService> _serviceMock;
        private readonly MemberContextController _controller;

        public MemberContextControllerTests()
        {
            _serviceMock = new Mock<IMemberContextService>();
            _controller = new MemberContextController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetMemberContext_ValidIdsWithContext_ReturnsOkWithContext()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var caseId = Guid.NewGuid();
            var context = new MemberContextDto();
            _serviceMock.Setup(s => s.GetMemberContextAsync(memberId, caseId)).ReturnsAsync(context);

            // Act
            var result = await _controller.GetMemberContext(memberId, caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(context, okResult.Value);
            _serviceMock.Verify(s => s.GetMemberContextAsync(memberId, caseId), Times.Once);
        }

        [Fact]
        public async Task GetMemberContext_ContextNotFound_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var caseId = Guid.NewGuid();
            _serviceMock.Setup(s => s.GetMemberContextAsync(memberId, caseId)).ReturnsAsync((MemberContextDto)null);

            // Act
            var result = await _controller.GetMemberContext(memberId, caseId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _serviceMock.Verify(s => s.GetMemberContextAsync(memberId, caseId), Times.Once);
        }

        [Fact]
        public async Task GetMemberContext_InvalidIds_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;
            var caseId = Guid.NewGuid();

            // Act
            var result = await _controller.GetMemberContext(memberId, caseId);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid identifiers.", badRequest.Value);
            _serviceMock.Verify(s => s.GetMemberContextAsync(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        }
    }
}
