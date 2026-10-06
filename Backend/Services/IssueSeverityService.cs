using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class IssueSeverityService : IIssueSeverityService
    {
        private readonly ICaseIssueRepository _caseIssueRepository;
        private readonly ICaseDataRepository _caseDataRepository;

        public IssueSeverityService(ICaseIssueRepository caseIssueRepository, ICaseDataRepository caseDataRepository)
        {
            _caseIssueRepository = caseIssueRepository;
            _caseDataRepository = caseDataRepository;
        }

        public async Task<CaseIssueListDto> GetCaseIssuesWithSeverityAsync(string caseId)
        {
            var caseData = await _caseDataRepository.GetCaseByIdAsync(caseId);
            if (caseData == null)
            {
                throw new CaseNotFoundException();
            }

            var issues = await _caseIssueRepository.GetIssuesForCaseAsync(caseId);
            if (issues == null || issues.Count == 0)
            {
                throw new IssuesNotFoundException();
            }

            var dto = new CaseIssueListDto
            {
                CaseId = caseId,
                Issues = issues.Select(i => new IssueSeverityDto
                {
                    IssueId = i.IssueId,
                    Summary = i.Summary,
                    Severity = i.Severity
                }).ToList()
            };

            return dto;
        }
    }
}
