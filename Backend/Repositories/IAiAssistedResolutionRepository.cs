using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAiAssistedResolutionRepository
    {
        Task<List<AiAssistedResolution>> GetAiAssistedInRangeAsync(DateTime fromDate, DateTime toDate);
    }
}
