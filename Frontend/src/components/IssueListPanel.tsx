import React from 'react';
import { useIssueList } from '../hooks/useIssueList';
import { IssueSeverityBadge } from './IssueSeverityBadge';

export const IssueListPanel: React.FC = () => {
  const { issues, loading, error } = useIssueList();

  if (loading) {
    return <div className="p-3 text-center">Loading issues...</div>;
  }

  if (error) {
    return <div className="alert alert-warning p-2">{error}</div>;
  }

  if (!issues.length) {
    return <div className="p-3 text-muted">No active issues.</div>;
  }

  return (
    <div className="p-3 border rounded mt-3">
      <h5 className="mb-3">Active Issues</h5>
      <ul className="list-group">
        {issues.map((issue) => (
          <li
            key={issue.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              issue.severity === 'High' || issue.severity === 'Critical' ? 'bg-danger-subtle' : ''
            }`}
          >
            <div>
              <div className="fw-bold">{issue.title}</div>
              <div className="small text-muted">Status: {issue.status}</div>
            </div>
            <IssueSeverityBadge severity={issue.severity} />
          </li>
        ))}
      </ul>
    </div>
  );
};
