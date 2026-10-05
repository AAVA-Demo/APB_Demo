using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Channels;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class InsightRefreshService : IInsightRefreshService
    {
        private readonly IAiInsightClient _aiClient;
        private readonly IInsightUpdateNotifier _notifier;

        public InsightRefreshService(IAiInsightClient aiClient, IInsightUpdateNotifier notifier)
        {
            _aiClient = aiClient;
            _notifier = notifier;
        }

        public async IAsyncEnumerable<InsightUpdateDto> SubscribeAsync(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InvalidOperationException("interactionId is required");
            }

            var channel = Channel.CreateUnbounded<InsightUpdateDto>();

            var observer = new ChannelObserver(channel);
            _notifier.Register(interactionId, observer);

            while (await channel.Reader.WaitToReadAsync().ConfigureAwait(false))
            {
                while (channel.Reader.TryRead(out var item))
                {
                    yield return item;
                }
            }
        }

        public async Task<InsightRefreshResponseDto> RefreshInsightsAsync(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InvalidOperationException("interactionId is required");
            }

            var latest = await _aiClient.GetLatestInsightsAsync(interactionId);

            if (latest.Insights == null || latest.Insights.Count == 0)
            {
                throw new InvalidOperationException("No insights available for interaction");
            }

            var payload = new InsightUpdateDto
            {
                InteractionId = latest.InteractionId,
                UpdatedAt = DateTime.UtcNow,
                Insights = latest.Insights,
                Recommendations = latest.Recommendations
            };

            _notifier.Notify(interactionId, payload);

            return new InsightRefreshResponseDto
            {
                InteractionId = interactionId,
                RefreshedAt = payload.UpdatedAt
            };
        }

        private sealed class ChannelObserver : IObserver<InsightUpdateDto>
        {
            private readonly Channel<InsightUpdateDto> _channel;

            public ChannelObserver(Channel<InsightUpdateDto> channel)
            {
                _channel = channel;
            }

            public void OnCompleted()
            {
            }

            public void OnError(Exception error)
            {
            }

            public void OnNext(InsightUpdateDto value)
            {
                _channel.Writer.TryWrite(value);
            }
        }
    }
}
