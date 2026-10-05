using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class IssueService : IIssueService
    {
        private readonly IIssueRepository _repository;

        public IssueService(IIssueRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<IssueDto>> GetActiveIssuesAsync()
        {
            var issues = await _repository.GetActiveIssuesAsync();

            return issues.Select(i => new IssueDto
            {
                Id = i.Id,
                Title = i.Title,
                Severity = i.Severity,
                Status = i.Status
            }).ToList();
        }

        public async Task<IssueDto?> GetIssueAsync(string issueId)
        {
            var issue = await _repository.GetIssueAsync(issueId);
            if (issue == null)
            {
                return null;
            }

            return new IssueDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Severity = issue.Severity,
                Status = issue.Status
            };
        }
    }
}
