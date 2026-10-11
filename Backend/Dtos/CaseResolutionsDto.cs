using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class CaseResolutionsDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        public List<ResolutionSuggestionDto> Resolutions { get; set; } = new List<ResolutionSuggestionDto>();
    }
}
