namespace Backend.Dtos
{
    public class RealTimeConnectionDto
    {
        public string ConnectionUrl { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string HubName { get; set; } = string.Empty;
    }
}
