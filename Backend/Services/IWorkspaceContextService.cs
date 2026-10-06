namespace Backend.Services
{
    public interface IWorkspaceContextService
    {
        string? GetCurrentMemberIssueId();
        string? GetCurrentAgentId();
    }
}
