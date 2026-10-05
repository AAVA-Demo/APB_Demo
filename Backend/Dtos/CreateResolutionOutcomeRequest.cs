using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class CreateResolutionOutcomeRequest
    {
        [Required]
        public string Outcome { get; set; } = string.Empty;

        public string? Comments { get; set; }
    }
}
