using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class AEntityRepository : IAEntityRepository
{
    private readonly AppDbContext _context;

    public AEntityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AEntity>> GetAllAsync()
    {
        return await _context.AEntities.AsNoTracking().ToListAsync();
    }

    public async Task<AEntity?> GetByIdAsync(int id)
    {
        return await _context.AEntities.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<AEntity> AddAsync(AEntity entity)
    {
        _context.AEntities.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<AEntity?> UpdateAsync(AEntity entity)
    {
        var existing = await _context.AEntities.FirstOrDefaultAsync(x => x.Id == entity.Id);
        if (existing == null)
        {
            return null;
        }

        existing.Name = entity.Name;
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.AEntities.FirstOrDefaultAsync(x => x.Id == id);
        if (existing == null)
        {
            return false;
        }

        _context.AEntities.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}
