import React from 'react';
import { IssueSeverity } from '../types/issues';

interface Props {
  severity: IssueSeverity;
}

export const IssueSeverityBadge: React.FC<Props> = ({ severity }) => {
  let className = 'badge bg-secondary';
  if (severity === 'High' || severity === 'Critical') {
    className = 'badge bg-danger';
  } else if (severity === 'Medium') {
    className = 'badge bg-warning text-dark';
  }

  return <span className={className}>{severity}</span>;
};
