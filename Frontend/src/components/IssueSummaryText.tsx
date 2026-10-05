import React from "react";

interface Props {
  summaryText: string;
  likelyCause: string;
}

export const IssueSummaryText: React.FC<Props> = ({
  summaryText,
  likelyCause,
}) => {
  return (
    <div>
      <p className="mb-2">{summaryText}</p>
      <div>
        <span className="fw-semibold">Likely Cause: </span>
        <span>{likelyCause}</span>
      </div>
    </div>
  );
};
