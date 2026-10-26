using System.Threading.Tasks;

namespace Backend.Services
{
    public class InsightEventListener : IInsightEventListener
    {
        private readonly IInsightRefreshService _service;

        public InsightEventListener(IInsightRefreshService service)
        {
            _service = service;
        }

        public Task StartAsync()
        {
            // Default implementation: no event source wired.
            return Task.CompletedTask;
        }
    }
}
