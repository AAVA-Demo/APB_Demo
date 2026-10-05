namespace Backend.Models
{
    public class MemberInteraction
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }
}
