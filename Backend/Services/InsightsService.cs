using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class InsightsService : IInsightsService
    {
        private readonly IInsightsRepository _repository;

        public InsightsService(IInsightsRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<MemberInsightDto>> GetInsightsAsync(Guid memberId)
        {
            var entities = await _repository.GetInsightsForMemberAsync(memberId);
            return entities.Select(ToDto).ToList();
        }

        public async Task<IReadOnlyList<MemberInsightDto>> RefreshInsightsAsync(Guid memberId, RefreshInsightsRequest? request)
        {
            var existing = await _repository.GetInsightsForMemberAsync(memberId);
            var updated = new List<MemberInsight>();
            var now = DateTime.UtcNow;

            foreach (var e in existing)
            {
                var clone = new MemberInsight
                {
                    Id = Guid.NewGuid(),
                    MemberId = e.MemberId,
                    Category = e.Category,
                    Description = e.Description,
                    Severity = e.Severity,
                    Status = e.Status,
                    GeneratedAt = now
                };

                if (string.Equals(e.Status, "Active", StringComparison.OrdinalIgnoreCase))
                {
                    clone.Status = "Improving";
                }

                updated.Add(clone);
            }

            if (updated.Count == 0)
            {
                updated.Add(new MemberInsight
                {
                    Id = Guid.NewGuid(),
                    MemberId = memberId,
                    Category = "General",
                    Description = "No prior insights. Initial analysis created.",
                    Severity = "Low",
                    Status = "Active",
                    GeneratedAt = now
                });
            }

            await _repository.SaveInsightsAsync(memberId, updated);

            return updated.Select(ToDto).ToList();
        }

        private static MemberInsightDto ToDto(MemberInsight entity)
        {
            return new MemberInsightDto
            {
                Id = entity.Id,
                Category = entity.Category,
                Description = entity.Description,
                Severity = entity.Severity,
                Status = entity.Status,
                GeneratedAt = entity.GeneratedAt
            };
        }
    }
}
