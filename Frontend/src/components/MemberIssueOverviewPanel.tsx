import React from 'react';
import { useMemberIssueContext } from '../hooks/useMemberIssueContext';
import { ActivityTimeline } from './ActivityTimeline';
import { HistorySummary } from './HistorySummary';

interface MemberIssueOverviewPanelProps {
    memberId: string;
    caseId: string;
}

export const MemberIssueOverviewPanel: React.FC<MemberIssueOverviewPanelProps> = ({ memberId, caseId }) => {
    const { context, loading, error } = useMemberIssueContext(memberId, caseId);

    return (
        <div className="mt-3">
            <h3 className="mb-3">Member Issue Overview</h3>
            {error && (
                <div className="alert alert-danger" role="alert">
                    Failed to load member context: {error}
                </div>
            )}
            {loading && (
                <div className="text-center my-2">
                    <div className="spinner-border" role="status" />
                </div>
            )}
            {!loading && context && (
                <>
                    <p className="mb-3">{context.issueDescription}</p>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <ActivityTimeline interactions={context.recentActivity} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <HistorySummary items={context.relevantHistory} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
