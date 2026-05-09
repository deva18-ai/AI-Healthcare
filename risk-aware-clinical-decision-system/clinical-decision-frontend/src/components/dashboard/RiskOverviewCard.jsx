import React from "react";
import "./Dashboard.css";

const colorByRisk = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const RiskOverviewCard = ({ decisions = [] }) => {
  const counts = decisions.reduce(
    (acc, d) => {
      acc[d.riskLevel] = (acc[d.riskLevel] || 0) + 1;
      return acc;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 }
  );

  return (
    <div className="card">
      <div className="section-title">
        <span role="img" aria-label="radar">📊</span>
        Risk Overview
      </div>
      <div className="card-grid">
        {["LOW", "MEDIUM", "HIGH"].map((level) => (
          <div key={level} className={`risk-pill ${colorByRisk[level]}`}>
            {level} • {counts[level]}
          </div>
        ))}
      </div>
      <p className="text-muted" style={{ marginTop: 12 }}>
        Distribution based on your most recent evaluation.
      </p>
    </div>
  );
};

export default RiskOverviewCard;

