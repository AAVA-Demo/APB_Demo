using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IIssueDetectionEngineClient
    {
        Task<IssueDetectionResult> DetectIssues(MemberContext context);
    }
}
