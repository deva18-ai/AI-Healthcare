import React from "react";
import "./common.css";

const Loader = ({ label = "Loading" }) => (
  <div style={{ textAlign: "center", padding: "24px 0" }}>
    <div className="loader" aria-label="loading" />
    <div style={{ marginTop: 10, color: "#5b6b7a", fontWeight: 600 }}>{label}</div>
  </div>
);

export default Loader;

