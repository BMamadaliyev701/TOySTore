import React from "react";

// Ma'lumotlarni prop'lar orqali qabul qiladi
function Course({ name, duration, level, instructor }) {
  const courseStyle = {
    border: "2px solid #28a745",
    padding: "15px",
    margin: "20px 0",
    borderRadius: "8px",
    backgroundColor: "#e9f7ed",
  };

  return (
    <div style={courseStyle}>
      <h3>🎓 Kurs: **{name}**</h3>
      <ul>
        <li>**Davomiyligi:** {duration}</li>
        <li>**Darajasi:** {level}</li>
        <li>**O‘qituvchi:** {instructor}</li>
      </ul>
    </div>
  );
}

export default Course;
