using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class AgentDesktopLayoutControllerTests
    {
        private readonly Mock<IAgentDesktopLayoutService> _layoutServiceMock;
        private readonly AgentDesktopLayoutController _controller;

        public AgentDesktopLayoutControllerTests()
        {
            _layoutServiceMock = new Mock<IAgentDesktopLayoutService>();
            _controller = new AgentDesktopLayoutController(_layoutServiceMock.Object);
        }

        [Fact]
        public async Task GetAgentDesktopLayout_LayoutExists_ReturnsOkWithLayout()
        {
            // Arrange
            var expectedLayout = new AgentDesktopLayoutConfigurationDto();
            _layoutServiceMock.Setup(s => s.GetLayoutConfiguration()).ReturnsAsync(expectedLayout);

            // Act
            var result = await _controller.GetAgentDesktopLayout();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedLayout, okResult.Value);
            _layoutServiceMock.Verify(s => s.GetLayoutConfiguration(), Times.Once);
        }

        [Fact]
        public async Task GetAgentDesktopLayout_LayoutIsNull_ReturnsOkWithNull()
        {
            // Arrange
            _layoutServiceMock.Setup(s => s.GetLayoutConfiguration()).ReturnsAsync((AgentDesktopLayoutConfigurationDto)null);

            // Act
            var result = await _controller.GetAgentDesktopLayout();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Null(okResult.Value);
            _layoutServiceMock.Verify(s => s.GetLayoutConfiguration(), Times.Once);
        }

        [Fact]
        public async Task GetAiDiagnosticPanelConfiguration_ConfigExists_ReturnsOkWithConfiguration()
        {
            // Arrange
            var expectedConfig = new AiDiagnosticPanelConfigurationDto();
            _layoutServiceMock.Setup(s => s.GetAiDiagnosticPanelConfiguration()).ReturnsAsync(expectedConfig);

            // Act
            var result = await _controller.GetAiDiagnosticPanelConfiguration();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(expectedConfig, okResult.Value);
            _layoutServiceMock.Verify(s => s.GetAiDiagnosticPanelConfiguration(), Times.Once);
        }

        [Fact]
        public async Task GetAiDiagnosticPanelConfiguration_ConfigIsNull_ReturnsOkWithNull()
        {
            // Arrange
            _layoutServiceMock.Setup(s => s.GetAiDiagnosticPanelConfiguration()).ReturnsAsync((AiDiagnosticPanelConfigurationDto)null);

            // Act
            var result = await _controller.GetAiDiagnosticPanelConfiguration();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Null(okResult.Value);
            _layoutServiceMock.Verify(s => s.GetAiDiagnosticPanelConfiguration(), Times.Once);
        }
    }
}
