using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationWorkflowService : IRemediationWorkflowService
    {
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;
        private readonly IRemediationWorkflowRepository _repository;

        public RemediationWorkflowService(IDiagnosticInsightsService diagnosticInsightsService, IRemediationWorkflowRepository repository)
        {
            _diagnosticInsightsService = diagnosticInsightsService;
            _repository = repository;
        }

        public async Task<RemediationWorkflowResponseDto> GetWorkflow(string caseId)
        {
            var workflow = await _repository.GetWorkflowByCaseId(caseId);
            var stepsDto = workflow.Steps.OrderBy(s => s.Order).Select(MapStepToDto).ToList();
            return new RemediationWorkflowResponseDto
            {
                CaseId = workflow.CaseId,
                IssueId = workflow.IssueId,
                Steps = stepsDto,
                OverallStatus = workflow.OverallStatus
            };
        }

        public async Task<RemediationWorkflowStartResponseDto> StartWorkflow(string caseId, string issueId)
        {
            _diagnosticInsightsService.ValidateIssueExists(issueId);
            var definitions = GetRemediationStepDefinitions(issueId);
            var workflow = new RemediationWorkflow
            {
                WorkflowId = Guid.NewGuid().ToString(),
                CaseId = caseId,
                IssueId = issueId,
                OverallStatus = "NotStarted",
                Steps = definitions.Select(d => new RemediationStepInstance
                {
                    StepInstanceId = Guid.NewGuid().ToString(),
                    DefinitionStepId = d.DefinitionStepId,
                    Order = d.Order,
                    Title = d.Title,
                    Description = d.Description,
                    IsRequired = d.IsRequired,
                    Status = "NotStarted",
                    UpdatedAtUtc = DateTime.UtcNow
                }).ToList()
            };

            await _repository.SaveWorkflow(workflow);
            return new RemediationWorkflowStartResponseDto
            {
                CaseId = caseId,
                IssueId = issueId,
                WorkflowId = workflow.WorkflowId,
                OverallStatus = workflow.OverallStatus
            };
        }

        public async Task<RemediationStepStatusDto> UpdateStepStatus(string caseId, string stepInstanceId, string status)
        {
            var step = await _repository.GetStepInstanceById(stepInstanceId);
            if (step == null)
            {
                throw new InvalidOperationException("StepInstanceId is required and must reference an existing step.");
            }

            if (!IsValidStatus(status))
            {
                throw new InvalidOperationException("Invalid step status or status transition.");
            }

            step.Status = status;
            step.UpdatedAtUtc = DateTime.UtcNow;
            await _repository.UpdateStepInstance(step);

            return new RemediationStepStatusDto
            {
                StepInstanceId = step.StepInstanceId,
                Status = step.Status,
                UpdatedAtUtc = step.UpdatedAtUtc
            };
        }

        public async Task<RemediationWorkflowStatusDto> GetWorkflowStatus(string caseId)
        {
            var workflow = await _repository.GetWorkflowByCaseId(caseId);
            var total = workflow.Steps.Count;
            var completed = workflow.Steps.Count(s => s.Status == "Completed");
            var overallStatus = completed == total ? "Resolved" : "InProgress";

            return new RemediationWorkflowStatusDto
            {
                CaseId = workflow.CaseId,
                WorkflowId = workflow.WorkflowId,
                OverallStatus = overallStatus,
                CompletedStepCount = completed,
                TotalStepCount = total
            };
        }

        private static RemediationStepInstanceDto MapStepToDto(RemediationStepInstance step)
        {
            return new RemediationStepInstanceDto
            {
                StepInstanceId = step.StepInstanceId,
                DefinitionStepId = step.DefinitionStepId,
                Order = step.Order,
                Title = step.Title,
                Description = step.Description,
                IsRequired = step.IsRequired,
                Status = step.Status
            };
        }

        private static bool IsValidStatus(string status)
        {
            return status == "NotStarted" || status == "InProgress" || status == "Completed";
        }

        private static List<RemediationStepDefinition> GetRemediationStepDefinitions(string issueId)
        {
            return new List<RemediationStepDefinition>
            {
                new RemediationStepDefinition
                {
                    DefinitionStepId = "def-1",
                    Order = 1,
                    Title = "Sample step 1",
                    Description = "First remediation step.",
                    IsRequired = true
                },
                new RemediationStepDefinition
                {
                    DefinitionStepId = "def-2",
                    Order = 2,
                    Title = "Sample step 2",
                    Description = "Second remediation step.",
                    IsRequired = false
                }
            };
        }
    }
}
