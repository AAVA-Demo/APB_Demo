using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Channels;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsUpdateService : IDiagnosticInsightsUpdateService
    {
        private readonly ISupportCaseRepository _supportCaseRepository;
        private readonly IDiagnosticInsightsEventPublisher _diagnosticInsightsEventPublisher;
        private readonly ConcurrentDictionary<string, List<Channel<DiagnosticInsightEventDto>>> _listeners = new();

        public DiagnosticInsightsUpdateService(ISupportCaseRepository supportCaseRepository, IDiagnosticInsightsEventPublisher diagnosticInsightsEventPublisher)
        {
            _supportCaseRepository = supportCaseRepository;
            _diagnosticInsightsEventPublisher = diagnosticInsightsEventPublisher;
        }

        public async Task<bool> NotifyInsightsUpdateAsync(string caseId, InsightsUpdateNotificationRequestDto request)
        {
            var supportCase = await _supportCaseRepository.GetByIdAsync(caseId);
            if (supportCase == null)
            {
                return false;
            }

            await _diagnosticInsightsEventPublisher.PublishInsightsUpdatedAsync(caseId);
            return true;
        }

        public ChannelReader<DiagnosticInsightEventDto> RegisterListener(string caseId)
        {
            var channel = Channel.CreateUnbounded<DiagnosticInsightEventDto>();
            var list = _listeners.GetOrAdd(caseId, _ => new List<Channel<DiagnosticInsightEventDto>>());
            lock (list)
            {
                list.Add(channel);
            }
            return channel.Reader;
        }

        public async Task PublishToListenersAsync(DiagnosticInsightEventDto evt)
        {
            if (_listeners.TryGetValue(evt.CaseId, out var channels))
            {
                List<Channel<DiagnosticInsightEventDto>> copy;
                lock (channels)
                {
                    copy = new List<Channel<DiagnosticInsightEventDto>>(channels);
                }

                foreach (var ch in copy)
                {
                    await ch.Writer.WriteAsync(evt);
                }
            }
        }
    }
}
