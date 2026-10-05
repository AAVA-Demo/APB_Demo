using Backend.Dtos;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseContextMapper
    {
        IssueSummaryDto ToIssueSummary(CaseContext context);
    }
}
