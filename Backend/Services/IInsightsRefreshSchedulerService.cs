namespace Backend.Services
{
    public interface IInsightsRefreshSchedulerService
    {
        void HandleMemberDataChange(string memberId);
        void ScheduleRefresh(string caseId);
    }
}
