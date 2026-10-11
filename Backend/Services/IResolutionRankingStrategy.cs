using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    public interface IResolutionRankingStrategy
    {
        List<ResolutionOption> Rank(List<ResolutionOption> options);
    }
}
