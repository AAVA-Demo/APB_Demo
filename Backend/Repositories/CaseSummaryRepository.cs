using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class CaseSummaryRepository : ICaseSummaryRepository
    {
        public Task<CaseSummaryDto?> GetCaseSummaryDataAsync(Guid caseId)
        {
            var dto = new CaseSummaryDto
            {
                CaseId = caseId,
                SummaryText = "Member has experienced intermittent connectivity issues.",
                ImpactDescription = "Moderate impact to daily usage.",
                LastUpdatedUtc = DateTime.UtcNow
            };
            return Task.FromResult<CaseSummaryDto?>(dto);
        }
    }
}
