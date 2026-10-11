using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Models;

namespace Backend.Services
{
    public class ResolutionRankingStrategy : IResolutionRankingStrategy
    {
        public List<ResolutionOption> Rank(List<ResolutionOption> options)
        {
            foreach (var option in options)
            {
                if (option.EstimatedTimeMinutes <= 0)
                {
                    throw new InvalidOperationException("Estimated resolution time must be positive.");
                }

                if (option.SuccessProbability < 0.0 || option.SuccessProbability > 1.0)
                {
                    throw new InvalidOperationException("Success probability must be between 0 and 1.");
                }
            }

            return options
                .OrderByDescending(o => o.SuccessProbability / optionTime(o.EstimatedTimeMinutes))
                .ToList();
        }

        private static double optionTime(int minutes) => minutes <= 0 ? 1 : minutes;
    }
}
