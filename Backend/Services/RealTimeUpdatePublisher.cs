using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class RealTimeUpdatePublisher : IRealTimeUpdatePublisher
    {
        public RealTimeConnectionDto NegotiateConnection(Guid issueId)
        {
            return new RealTimeConnectionDto
            {
                ConnectionUrl = "wss://example.com/realtime",
                AccessToken = string.Empty,
                HubName = "diagnosticInsightsHub"
            };
        }

        public Task PublishInsightsAsync(Guid issueId, IList<InsightDto> insights)
        {
            return Task.CompletedTask;
        }
    }
}
