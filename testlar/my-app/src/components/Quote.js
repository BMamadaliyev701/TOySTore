import React from "react";

// Ma'lumotlarni prop'lar orqali qabul qiladi
function Quote({ text, author }) {
  const quoteStyle = {
    borderLeft: "5px solid #ffc107",
    padding: "10px 20px",
    margin: "20px 0",
    backgroundColor: "#fffbe6",
    fontStyle: "italic",
  };

  const authorStyle = {
    display: "block",
    textAlign: "right",
    marginTop: "10px",
    fontWeight: "bold",
    color: "#6c757d",
  };

  return (
    <figure style={quoteStyle}>
      <blockquote cite="Muallif manbasi" style={{ margin: 0 }}>
        "{text}"
      </blockquote>
      <figcaption style={authorStyle}>— {author}</figcaption>
    </figure>
  );
}

export default Quote;
