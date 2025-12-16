import React from "react";

function Header() {
  const headerStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "15px 20px",
    textAlign: "center",
    fontSize: "1.5em",
  };

  return (
    <header style={headerStyle}>
      <h1>Men Haqimda Sahifasi</h1>
      <p>Dasturchi portfoliomga xush kelibsiz!</p>
    </header>
  );
}

export default Header;
