import React from "react";

function Footer() {
  const footerStyle = {
    backgroundColor: "#333",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    fontSize: "0.9em",
    marginTop: "20px",
  };

  return (
    <footer style={footerStyle}>
      <p>
        © {new Date().getFullYear()} Dasturchi Portfoliosi. Barcha huquqlar
        himoyalangan.
      </p>
    </footer>
  );
}

export default Footer;
