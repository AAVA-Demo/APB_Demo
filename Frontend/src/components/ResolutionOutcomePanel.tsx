import React from 'react';
import { useResolutionOutcome } from '../hooks/useResolutionOutcome';

interface Props {
  issueId: string;
}

export const ResolutionOutcomePanel: React.FC<Props> = ({ issueId }) => {
  const {
    selectedOutcome,
    setSelectedOutcome,
    comments,
    setComments,
    loading,
    error,
    success,
    submit,
  } = useResolutionOutcome(issueId);

  return (
    <div className="p-3 border rounded mt-3">
      <h5 className="mb-3">Resolution Outcome</h5>
      {error && <div className="alert alert-warning p-2 mb-2">{error}</div>}
      {success && <div className="alert alert-success p-2 mb-2">{success}</div>}
      <div className="mb-2">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="resolvedOption"
            checked={selectedOutcome === 'Resolved'}
            onChange={() => setSelectedOutcome('Resolved')}
          />
          <label className="form-check-label" htmlFor="resolvedOption">
            Resolved
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="notResolvedOption"
            checked={selectedOutcome === 'NotResolved'}
            onChange={() => setSelectedOutcome('NotResolved')}
          />
          <label className="form-check-label" htmlFor="notResolvedOption">
            Not Resolved
          </label>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Comments (optional)</label>
        <textarea
          className="form-control"
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={submit}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Outcome'}
      </button>
    </div>
  );
};
