using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class AEntityService : IAEntityService
{
    private readonly IAEntityRepository _repository;

    public AEntityService(IAEntityRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AEntityDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(MapToDto).ToList();
    }

    public async Task<AEntityDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<AEntityDto> CreateAsync(AEntityDto dto)
    {
        var entity = new AEntity { Name = dto.Name };
        var created = await _repository.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<AEntityDto?> UpdateAsync(int id, AEntityDto dto)
    {
        var entity = new AEntity { Id = id, Name = dto.Name };
        var updated = await _repository.UpdateAsync(entity);
        return updated == null ? null : MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static AEntityDto MapToDto(AEntity entity)
    {
        return new AEntityDto
        {
            Id = entity.Id,
            Name = entity.Name
        };
    }
}
