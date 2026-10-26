using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IInsightEventListener
    {
        Task StartAsync();
    }
}
