using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IResolutionSuggestionService
    {
        Task<CaseResolutionsDto> GetPrioritizedResolutionsAsync(string caseId);
    }
}
