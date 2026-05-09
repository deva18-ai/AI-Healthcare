import React from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const RiskCard = ({ decision }) => {
  const riskLevel = decision?.riskLevel || "LOW";
  const riskScore = decision?.riskScore ?? 0;
  const isHigh = riskLevel === "HIGH";
  const isMedium = riskLevel === "MEDIUM";

  const getIcon = () => {
    if (isHigh) return <AlertTriangle size={20} />;
    if (isMedium) return <Info size={20} />;
    return <CheckCircle size={20} />;
  };

  return (
    <div className={`risk-card ${riskLevel.toLowerCase()}`}>
      <div className="risk-header">
        <div className="risk-badge">
          {getIcon()}
          <span style={{ marginLeft: 6 }}>{riskLevel} Risk</span>
        </div>
        <div className="risk-score">
          Score: {Math.round(riskScore * 100)}%
        </div>
      </div>
      <div className="decision-action">
        {decision?.recommendedAction}
      </div>
      <div className="decision-explanation">
        {decision?.explanation}
      </div>
    </div>
  );
};

export default RiskCard;
