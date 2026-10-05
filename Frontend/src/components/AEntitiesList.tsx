import React from "react";
import { useAEntities } from "../hooks/useAEntities";

interface Props {
  caseId?: string;
  issueId?: string;
  memberId?: string;
  agentId?: string;
}

const AEntitiesList: React.FC<Props> = () => {
  const { data, loading, error } = useAEntities();

  if (loading) {
    return <div className="text-center p-3">Loading...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-muted p-3">No items available.</div>;
  }

  return (
    <div className="p-3">
      <h5 className="mb-3">A Entities</h5>
      <ul className="list-group">
        {data.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <span>{item.name}</span>
            <span className="badge bg-secondary">#{item.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AEntitiesList;
