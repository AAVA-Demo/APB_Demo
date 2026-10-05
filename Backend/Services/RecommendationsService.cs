using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendationsService : IRecommendationsService
    {
        private readonly IRecommendationsRepository _repository;

        public RecommendationsService(IRecommendationsRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<RecommendationDto>> GetRecommendationsAsync(Guid memberId)
        {
            var entities = await _repository.GetRecommendationsAsync(memberId);

            foreach (var rec in entities)
            {
                if (rec.PriorityRank <= 0)
                {
                    rec.PriorityRank = rec.ImpactScore * 2 + rec.UrgencyScore;
                }
            }

            var ordered = entities
                .OrderByDescending(r => r.PriorityRank)
                .ThenByDescending(r => r.ImpactScore)
                .ThenByDescending(r => r.UrgencyScore)
                .ToList();

            return ordered.Select(ToDto).ToList();
        }

        private static RecommendationDto ToDto(Recommendation entity)
        {
            return new RecommendationDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                ImpactScore = entity.ImpactScore,
                UrgencyScore = entity.UrgencyScore,
                PriorityRank = entity.PriorityRank
            };
        }
    }
}
