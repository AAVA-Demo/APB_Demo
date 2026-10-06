namespace Backend.Services
{
    public interface IMemberEventStreamClient
    {
        void SubscribeToMemberEvents(string memberId);
    }
}
