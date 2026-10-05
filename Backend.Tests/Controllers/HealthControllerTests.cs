using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class HealthControllerTests
    {
        [Fact]
        public async Task Get_WhenServiceReturnsStatus_ReturnsOkWithStatus()
        {
            // Arrange
            var expectedStatus = "Healthy";
            var healthServiceMock = new Mock<IHealthService>();
            healthServiceMock
                .Setup(s => s.GetHealthStatusAsync())
                .ReturnsAsync(expectedStatus);

            var controller = new HealthController(healthServiceMock.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedStatus, okResult.Value);
        }

        [Fact]
        public async Task Get_ServiceReturnsNull_ReturnsOkWithNull()
        {
            // Arrange
            var healthServiceMock = new Mock<IHealthService>();
            healthServiceMock
                .Setup(s => s.GetHealthStatusAsync())
                .ReturnsAsync((string)null);

            var controller = new HealthController(healthServiceMock.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Null(okResult.Value);
        }

        [Fact]
        public async Task Get_CallsHealthServiceExactlyOnce()
        {
            // Arrange
            var healthServiceMock = new Mock<IHealthService>();
            healthServiceMock
                .Setup(s => s.GetHealthStatusAsync())
                .ReturnsAsync("Healthy");

            var controller = new HealthController(healthServiceMock.Object);

            // Act
            await controller.Get();

            // Assert
            healthServiceMock.Verify(s => s.GetHealthStatusAsync(), Times.Once);
        }
    }
}
