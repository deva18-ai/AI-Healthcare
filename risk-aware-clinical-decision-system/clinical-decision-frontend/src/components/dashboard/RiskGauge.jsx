import React from "react";

const RiskGauge = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score * circumference);
  
  const getColor = (s) => {
    if (s < 0.3) return "#10b981"; // Success
    if (s < 0.7) return "#f59e0b"; // Warning
    return "#ef4444"; // Danger
  };

  const color = getColor(score);

  return (
    <div className="gauge-container">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        {/* Score Text */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="18"
          fontWeight="bold"
          fill="#1e293b"
        >
          {Math.round(score * 100)}%
        </text>
      </svg>
      <div className="gauge-label">Clinical Risk</div>
      <style>{`
        .gauge-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
        }
        .gauge-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default RiskGauge;
