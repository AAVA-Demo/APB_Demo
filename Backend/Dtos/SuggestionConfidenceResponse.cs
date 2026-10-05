namespace Backend.Dtos
{
    public class SuggestionConfidenceResponse
    {
        public string MemberId { get; set; } = string.Empty;
        public List<SuggestionConfidenceDto> Suggestions { get; set; } = new();
    }
}
