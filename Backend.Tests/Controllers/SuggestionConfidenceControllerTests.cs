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
    public class SuggestionConfidenceControllerTests
    {
        private readonly Mock<ISuggestionConfidenceService> _serviceMock;
        private readonly SuggestionConfidenceController _controller;

        public SuggestionConfidenceControllerTests()
        {
            _serviceMock = new Mock<ISuggestionConfidenceService>();
            _controller = new SuggestionConfidenceController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetSuggestionsWithConfidence_ValidMemberId_ReturnsOkWithResult()
        {
            var memberId = "member-1";
            var response = new SuggestionConfidenceResponse();
            _serviceMock.Setup(s => s.GetSuggestionsWithConfidenceAsync(memberId))
                .ReturnsAsync(response);

            var result = await _controller.GetSuggestionsWithConfidence(memberId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Same(response, okResult.Value);
            _serviceMock.Verify(s => s.GetSuggestionsWithConfidenceAsync(memberId), Times.Once);
        }

        [Fact]
        public async Task GetSuggestionsWithConfidence_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            var memberId = "bad-member";
            _serviceMock.Setup(s => s.GetSuggestionsWithConfidenceAsync(memberId))
                .ThrowsAsync(new ArgumentException("invalid"));

            var result = await _controller.GetSuggestionsWithConfidence(memberId);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequest.Value);
            _serviceMock.Verify(s => s.GetSuggestionsWithConfidenceAsync(memberId), Times.Once);
        }
    }
}
