using System;
using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class RealTimeInsightSource : IRealTimeInsightSource
    {
        public List<RealTimeInsightDto> GetLatestInsights(string caseId)
        {
            return new List<RealTimeInsightDto>
            {
                new RealTimeInsightDto
                {
                    Id = Guid.NewGuid().ToString(),
                    Summary = "Recent diagnostic insight",
                    Details = "Detailed information about the recent diagnostic insight.",
                    GeneratedAt = DateTimeOffset.UtcNow
                }
            };
        }
    }
}
