namespace Backend.Models
{
    public class ResolutionOption
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int EstimatedTimeMinutes { get; set; }
        public double SuccessProbability { get; set; }
    }
}
