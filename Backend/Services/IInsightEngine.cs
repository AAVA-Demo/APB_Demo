using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    public interface IInsightEngine
    {
        List<Insight> GenerateInsights(string caseId);
    }
}
