import React from "react";
import { CaseViewPanel } from "./CaseViewPanel";

interface Props {
  workspaceId: string;
  caseId: string;
}

export const WorkspaceLayout: React.FC<Props> = ({ workspaceId, caseId }) => {
  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-12 col-lg-8">
          <CaseViewPanel workspaceId={workspaceId} caseId={caseId} />
        </div>
      </div>
    </div>
  );
};
