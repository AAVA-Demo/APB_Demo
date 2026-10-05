using Backend.Dtos;
using Backend.Models;

namespace Backend.Repositories
{
    public class CaseContextMapper : ICaseContextMapper
    {
        public IssueSummaryDto ToIssueSummary(CaseContext context)
        {
            return new IssueSummaryDto
            {
                Title = $"Case {context.CaseId} summary",
                Description = "Generated issue summary based on case context."
            };
        }
    }
}
