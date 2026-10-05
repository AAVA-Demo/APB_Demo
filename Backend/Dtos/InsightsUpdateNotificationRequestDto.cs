using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class InsightsUpdateNotificationRequestDto
    {
        [Required]
        public string ChangeType { get; set; } = string.Empty;
        public List<string> ChangedFields { get; set; } = new List<string>();
    }
}
