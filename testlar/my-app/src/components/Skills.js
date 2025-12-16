import React from "react";

function Skills() {
  const skillsList = [
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "HTML/CSS",
  ];

  const sectionStyle = {
    padding: "20px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  return (
    <section style={sectionStyle}>
      <h2>Ko'nikmalarim (Skills)</h2>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {skillsList.map((skill, index) => (
          <li key={index}>**{skill}**</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
