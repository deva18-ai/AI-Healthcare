import React from "react";
import "./common.css";

const Footer = () => (
  <footer className="footer">
    Clinical Decision Intelligence • Built for clinician decision support • {new Date().getFullYear()}
  </footer>
);

export default Footer;

