using System;

namespace Backend.Dtos
{
    public class DiagnosticInsightDto
    {
        public Guid Id { get; set; }
        public Guid CaseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double RelevanceScore { get; set; }
    }
}
