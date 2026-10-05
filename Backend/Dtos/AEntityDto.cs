using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos;

public class AEntityDto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
