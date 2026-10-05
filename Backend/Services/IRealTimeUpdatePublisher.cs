using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRealTimeUpdatePublisher
    {
        RealTimeConnectionDto NegotiateConnection(Guid issueId);
        Task PublishInsightsAsync(Guid issueId, IList<InsightDto> insights);
    }
}
