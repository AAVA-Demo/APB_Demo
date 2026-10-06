namespace Backend.Models
{
    public class MemberInteractionContext
    {
        public string MemberId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string CurrentDataJson { get; set; } = string.Empty;
        public string InteractionDataJson { get; set; } = string.Empty;
    }
}
