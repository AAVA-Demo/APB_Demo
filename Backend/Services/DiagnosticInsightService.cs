using System;
using System.Collections.Generic;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightService : IDiagnosticInsightService
    {
        private readonly ICaseContextResolverService _contextResolver;
        private readonly ICaseContextMapper _mapper;
        private readonly IAIInsightEngine _engine;

        public DiagnosticInsightService(
            ICaseContextResolverService contextResolver,
            ICaseContextMapper mapper,
            IAIInsightEngine engine)
        {
            _contextResolver = contextResolver;
            _mapper = mapper;
            _engine = engine;
        }

        public DiagnosticPanelResponseDto? GetPanelData(string caseId, string? memberId)
        {
            var context = _contextResolver.ResolveCaseContext(caseId, memberId);
            if (context == null)
            {
                return null;
            }

            var issueSummary = _mapper.ToIssueSummary(context);
            var insights = new List<InsightDto>
            {
                new InsightDto
                {
                    Id = Guid.NewGuid().ToString(),
                    Category = "GENERAL",
                    Description = "Sample diagnostic insight.",
                    CreatedAt = DateTimeOffset.UtcNow
                }
            };

            return new DiagnosticPanelResponseDto
            {
                CaseId = context.CaseId,
                MemberId = context.MemberId,
                IssueSummary = issueSummary,
                Insights = insights,
                PanelContext = new PanelContextDto
                {
                    SourceSystem = context.SourceSystem,
                    OpenedBy = "system"
                }
            };
        }
    }
}
