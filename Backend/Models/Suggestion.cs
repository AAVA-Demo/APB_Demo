namespace Backend.Models
{
    public class Suggestion
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ModelScore { get; set; }
    }
}
