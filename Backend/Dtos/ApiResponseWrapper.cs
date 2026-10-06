namespace Backend.Dtos
{
    public class ApiResponseWrapper<T>
    {
        public string Status { get; set; } = string.Empty;
        public T? Data { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
