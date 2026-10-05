import React from 'react';
import { Recommendation } from '../types/recommendations';

interface Props {
  recommendation: Recommendation;
}

export const RecommendationItem: React.FC<Props> = ({ recommendation }) => {
  return (
    <li className="mb-2 p-2 border rounded d-flex justify-content-between align-items-start">
      <div>
        <div className="fw-bold">{recommendation.title}</div>
        <div className="small text-muted">{recommendation.description}</div>
      </div>
      <span className="badge bg-secondary ms-2">Priority {recommendation.priority}</span>
    </li>
  );
};
