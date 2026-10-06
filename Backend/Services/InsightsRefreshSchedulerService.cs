using System;

namespace Backend.Services
{
    public class InsightsRefreshSchedulerService : IInsightsRefreshSchedulerService
    {
        public void HandleMemberDataChange(string memberId)
        {
            Console.WriteLine($"Member data changed for {memberId}.");
        }

        public void ScheduleRefresh(string caseId)
        {
            Console.WriteLine($"Scheduled refresh for case {caseId}.");
        }
    }
}
