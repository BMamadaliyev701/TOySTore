import React from 'react';
import './Brands.css';

const Brands = ({ onBrandClick }) => {
    const brands = [
        { name: "LEGO Group", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/2048px-LEGO_logo.svg.png", color: "#FFD700" },
        { name: "Mattel", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS55qw9_PDX5_0uk49MIwbB0ZrgiWqs3A673w&s", color: "#E0218A" },
        { name: "SpeedToys", img: "https://cdn-icons-png.flaticon.com/512/3081/3081986.png", color: "#FF4500" },
        { name: "TechToys", img: "https://cdn-icons-png.flaticon.com/512/3662/3662817.png", color: "#4169E1" },
        { name: "DreamHouse", img: "https://cdn-icons-png.flaticon.com/512/619/619153.png", color: "#9370DB" },
        { name: "WildLife Toys", img: "https://cdn-icons-png.flaticon.com/512/1998/1998342.png", color: "#32CD32" }
    ];

    return (
        <div className="brands-grid-react">
            {brands.map((brand, index) => (
                <div
                    key={index}
                    className="brand-item-react"
                    style={{ '--hover-color': brand.color }}
                    onClick={() => onBrandClick && onBrandClick(brand.name)}
                >
                    <div className="brand-icon-wrapper">
                        <img src={brand.img} alt={`${brand.name} logo`} />
                    </div>
                    <span className="brand-name">{brand.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Brands;
