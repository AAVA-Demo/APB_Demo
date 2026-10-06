using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class TriggerManualInsightsRefreshRequestDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
    }
}
