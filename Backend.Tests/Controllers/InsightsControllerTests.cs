using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.Tests.Controllers
{
    public class InsightsControllerTests
    {
        private readonly Mock<IInsightsService> _serviceMock;
        private readonly InsightsController _controller;

        public InsightsControllerTests()
        {
            _serviceMock = new Mock<IInsightsService>();
            _controller = new InsightsController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetInsights_ValidMemberId_ReturnsOkWithInsights()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var insights = new List<MemberInsightDto> { new MemberInsightDto() };
            _serviceMock
                .Setup(s => s.GetInsightsAsync(memberId))
                .ReturnsAsync(insights);

            // Act
            var result = await _controller.GetInsights(memberId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(insights, okResult.Value);
            _serviceMock.Verify(s => s.GetInsightsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetInsights_EmptyMemberId_ReturnsBadRequest()
        {
            // Arrange
            var memberId = Guid.Empty;

            // Act
            var result = await _controller.GetInsights(memberId);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            _serviceMock.Verify(s => s.GetInsightsAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task GetInsights_NoInsights_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            _serviceMock
                .Setup(s => s.GetInsightsAsync(memberId))
                .ReturnsAsync(Enumerable.Empty<MemberInsightDto>());

            // Act
            var result = await _controller.GetInsights(memberId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.GetInsightsAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task RefreshInsights_ValidInput_ReturnsOkWithRefreshedInsights()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            var request = new RefreshInsightsRequest();
            var refreshed = new List<MemberInsightDto> { new MemberInsightDto() };
            _serviceMock
                .Setup(s => s.RefreshInsightsAsync(memberId, request))
                .ReturnsAsync(refreshed);

            // Act
            var result = await _controller.RefreshInsights(memberId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(refreshed, okResult.Value);
            _serviceMock.Verify(s => s.RefreshInsightsAsync(memberId, request), Times.Once);
        }

        [Fact]
        public async Task RefreshInsights_NoRefreshedInsights_ReturnsNotFound()
        {
            // Arrange
            var memberId = Guid.NewGuid();
            RefreshInsightsRequest request = null;
            _serviceMock
                .Setup(s => s.RefreshInsightsAsync(memberId, request))
                .ReturnsAsync(Enumerable.Empty<MemberInsightDto>());

            // Act
            var result = await _controller.RefreshInsights(memberId, request);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _serviceMock.Verify(s => s.RefreshInsightsAsync(memberId, request), Times.Once);
        }
    }
}
