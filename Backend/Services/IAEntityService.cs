using Backend.Dtos;

namespace Backend.Services;

public interface IAEntityService
{
    Task<List<AEntityDto>> GetAllAsync();
    Task<AEntityDto?> GetByIdAsync(int id);
    Task<AEntityDto> CreateAsync(AEntityDto dto);
    Task<AEntityDto?> UpdateAsync(int id, AEntityDto dto);
    Task<bool> DeleteAsync(int id);
}
