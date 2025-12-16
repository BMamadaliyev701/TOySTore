import React from "react";

function AboutMe() {
  const sectionStyle = {
    padding: "20px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  return (
    <section style={sectionStyle}>
      <h2>Mening Faoliyatim</h2>
      <p>
        Men to'liq stakli (Full-stack) dasturchiman, React va Node.js
        texnologiyalariga ixtisoslashganman. Kopmleks muammolarga kreativ
        yechimlar topishni yaxshi ko'raman.
      </p>
      <p>**Yosh:** 30</p>
      <p>**Manzil:** Toshkent, O'zbekiston</p>
    </section>
  );
}

export default AboutMe;
