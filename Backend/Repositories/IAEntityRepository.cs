using Backend.Models;

namespace Backend.Repositories;

public interface IAEntityRepository
{
    Task<List<AEntity>> GetAllAsync();
    Task<AEntity?> GetByIdAsync(int id);
    Task<AEntity> AddAsync(AEntity entity);
    Task<AEntity?> UpdateAsync(AEntity entity);
    Task<bool> DeleteAsync(int id);
}
