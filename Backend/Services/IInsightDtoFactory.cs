using System.Collections.Generic;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public interface IInsightDtoFactory
    {
        CaseInsightsDto Build(string caseId, List<Insight> insights, List<Insight> remediations);
    }
}
