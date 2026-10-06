using System;

namespace Backend.Services
{
    public class MemberEventStreamClient : IMemberEventStreamClient
    {
        public void SubscribeToMemberEvents(string memberId)
        {
            Console.WriteLine($"Subscribed to events for member {memberId}.");
        }
    }
}
