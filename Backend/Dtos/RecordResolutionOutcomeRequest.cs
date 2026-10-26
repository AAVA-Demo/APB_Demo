using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RecordResolutionOutcomeRequest
    {
        [Required]
        public bool IsResolved { get; set; }

        [MaxLength(500)]
        public string Comment { get; set; } = string.Empty;

        [Required]
        public string RecordedBy { get; set; } = string.Empty;
    }
}
