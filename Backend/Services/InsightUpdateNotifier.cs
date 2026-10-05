using System;
using System.Collections.Concurrent;
using Backend.Dtos;

namespace Backend.Services
{
    public class InsightUpdateNotifier : IInsightUpdateNotifier
    {
        private readonly ConcurrentDictionary<string, ConcurrentBag<IObserver<InsightUpdateDto>>> _observers = new();

        public void Register(string interactionId, IObserver<InsightUpdateDto> observer)
        {
            var bag = _observers.GetOrAdd(interactionId, _ => new ConcurrentBag<IObserver<InsightUpdateDto>>());
            bag.Add(observer);
        }

        public void Notify(string interactionId, InsightUpdateDto payload)
        {
            if (_observers.TryGetValue(interactionId, out var bag))
            {
                foreach (var observer in bag)
                {
                    observer.OnNext(payload);
                }
            }
        }
    }
}
