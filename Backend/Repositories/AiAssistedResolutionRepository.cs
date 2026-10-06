using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AiAssistedResolutionRepository : IAiAssistedResolutionRepository
    {
        private readonly AppDbContext _context;

        public AiAssistedResolutionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AiAssistedResolution>> GetAiAssistedInRangeAsync(DateTime fromDate, DateTime toDate)
        {
            return await _context.AiAssistedResolutions.Where(x => x.IsAiAssisted && x.ResolvedAt >= fromDate && x.ResolvedAt <= toDate).ToListAsync();
        }
    }
}
