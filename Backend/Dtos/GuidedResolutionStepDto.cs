namespace Backend.Dtos
{
    public class GuidedResolutionStepDto
    {
        public string Id { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
