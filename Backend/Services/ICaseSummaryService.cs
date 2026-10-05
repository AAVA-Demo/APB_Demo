using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface ICaseSummaryService
    {
        Task<CaseSummaryDto?> GetCaseSummaryAsync(Guid caseId);
    }
}
