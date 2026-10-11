using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class DiagnosticPanelControllerTests
    {
        [Fact]
        public async Task GetDiagnosticPanelContext_ValidIds_ReturnsOkWithContext()
        {
            // Arrange
            var workspaceId = "ws-1";
            var caseId = "case-1";
            var contextDto = new DiagnosticPanelContextDto();
            var panelServiceMock = new Mock<IDiagnosticPanelService>();
            var workspaceServiceMock = new Mock<IWorkspaceIntegrationService>();

            workspaceServiceMock
                .Setup(s => s.IsPanelEnabledAsync(workspaceId))
                .ReturnsAsync(true);
            panelServiceMock
                .Setup(s => s.GetPanelContextAsync(workspaceId, caseId))
                .ReturnsAsync(contextDto);

            var controller = new DiagnosticPanelController(panelServiceMock.Object, workspaceServiceMock.Object);

            // Act
            var result = await controller.GetDiagnosticPanelContext(workspaceId, caseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(contextDto, okResult.Value);
            workspaceServiceMock.Verify(s => s.IsPanelEnabledAsync(workspaceId), Times.Once);
            panelServiceMock.Verify(s => s.GetPanelContextAsync(workspaceId, caseId), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_EmptyWorkspaceId_ReturnsBadRequest()
        {
            // Arrange
            var panelServiceMock = new Mock<IDiagnosticPanelService>();
            var workspaceServiceMock = new Mock<IWorkspaceIntegrationService>();
            var controller = new DiagnosticPanelController(panelServiceMock.Object, workspaceServiceMock.Object);

            // Act
            var result = await controller.GetDiagnosticPanelContext(" ", "case-1");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("WorkspaceId is required.", badRequest.Value);
            workspaceServiceMock.Verify(s => s.IsPanelEnabledAsync(It.IsAny<string>()), Times.Never);
            panelServiceMock.Verify(s => s.GetPanelContextAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_EmptyCaseId_ReturnsBadRequest()
        {
            // Arrange
            var panelServiceMock = new Mock<IDiagnosticPanelService>();
            var workspaceServiceMock = new Mock<IWorkspaceIntegrationService>();
            var controller = new DiagnosticPanelController(panelServiceMock.Object, workspaceServiceMock.Object);

            // Act
            var result = await controller.GetDiagnosticPanelContext("ws-1", " ");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("CaseId is required.", badRequest.Value);
            workspaceServiceMock.Verify(s => s.IsPanelEnabledAsync(It.IsAny<string>()), Times.Never);
            panelServiceMock.Verify(s => s.GetPanelContextAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_WorkspaceNotFound_ReturnsNotFound()
        {
            // Arrange
            var workspaceId = "ws-missing";
            var caseId = "case-1";
            var panelServiceMock = new Mock<IDiagnosticPanelService>();
            var workspaceServiceMock = new Mock<IWorkspaceIntegrationService>();

            workspaceServiceMock
                .Setup(s => s.IsPanelEnabledAsync(workspaceId))
                .ThrowsAsync(new WorkspaceNotFoundException());

            var controller = new DiagnosticPanelController(panelServiceMock.Object, workspaceServiceMock.Object);

            // Act
            var result = await controller.GetDiagnosticPanelContext(workspaceId, caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Workspace not found.", notFound.Value);
        }

        [Fact]
        public async Task GetDiagnosticPanelContext_PanelDisabled_ReturnsNotFoundPanelUnavailable()
        {
            // Arrange
            var workspaceId = "ws-disabled";
            var caseId = "case-1";
            var panelServiceMock = new Mock<IDiagnosticPanelService>();
            var workspaceServiceMock = new Mock<IWorkspaceIntegrationService>();

            workspaceServiceMock
                .Setup(s => s.IsPanelEnabledAsync(workspaceId))
                .ReturnsAsync(false);

            var controller = new DiagnosticPanelController(panelServiceMock.Object, workspaceServiceMock.Object);

            // Act
            var result = await controller.GetDiagnosticPanelContext(workspaceId, caseId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Diagnostic panel is not available for this workspace.", notFound.Value);
        }
    }
}
