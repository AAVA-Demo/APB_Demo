using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class IssueContextSummaryService : IIssueContextSummaryService
    {
        private readonly IIssueContextMapper _mapper;

        public IssueContextSummaryService(IIssueContextMapper mapper)
        {
            _mapper = mapper;
        }

        public IssueContextSummaryResponseDto? GetSummary(string caseId)
        {
            return _mapper.ToSummaryResponse(caseId);
        }
    }
}
