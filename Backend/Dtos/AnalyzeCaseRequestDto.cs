using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class AnalyzeCaseRequestDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
    }
}
