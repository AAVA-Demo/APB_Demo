using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface ICaseSummaryRepository
    {
        Task<CaseSummaryDto?> GetCaseSummaryDataAsync(Guid caseId);
    }
}
