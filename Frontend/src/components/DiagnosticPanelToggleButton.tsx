import React from "react";

interface Props {
  onClick: () => void;
}

export const DiagnosticPanelToggleButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      Diagnostic Panel
    </button>
  );
};
