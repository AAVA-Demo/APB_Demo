using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightUpdateNotifier
    {
        void Register(string interactionId, System.IObserver<InsightUpdateDto> observer);
        void Notify(string interactionId, InsightUpdateDto payload);
    }
}
