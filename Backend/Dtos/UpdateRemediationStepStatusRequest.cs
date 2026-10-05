using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class UpdateRemediationStepStatusRequest
    {
        [Required]
        public bool IsCompleted { get; set; }
    }
}
