using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class MemberHistoryClient : IMemberHistoryClient
    {
        public Task<IReadOnlyList<MemberHistoryEvent>> GetMemberHistoryAsync(string memberId)
        {
            var events = new List<MemberHistoryEvent>
            {
                new MemberHistoryEvent
                {
                    Id = Guid.NewGuid().ToString(),
                    MemberId = memberId,
                    Summary = "Recent interaction with support.",
                    EventDate = DateTime.UtcNow.AddDays(-1),
                    Type = "CALL"
                }
            };

            return Task.FromResult((IReadOnlyList<MemberHistoryEvent>)events);
        }
    }
}
