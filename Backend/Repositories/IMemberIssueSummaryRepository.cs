using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public sealed class CaseAndInteractionsResult
    {
        public Case? Case { get; set; }
        public List<Interaction> Interactions { get; set; } = new List<Interaction>();
    }

    public interface IMemberIssueSummaryRepository
    {
        Task<CaseAndInteractionsResult> GetCaseAndInteractionsAsync(Guid memberId);
    }
}
