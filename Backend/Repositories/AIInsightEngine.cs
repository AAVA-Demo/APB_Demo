using System;
using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class AIInsightEngine : IAIInsightEngine
    {
        public List<BaseInsightDto> GetInsights(string caseId)
        {
            return new List<BaseInsightDto>
            {
                new BaseInsightDto
                {
                    Id = Guid.NewGuid().ToString(),
                    Description = "AI generated insight.",
                    ConfidenceScore = 0.8
                }
            };
        }
    }
}
