import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onOpenDetail, isInCart }) => {
    const { title, brand, price, oldPrice, description, image, isHit, isNew, discount } = product;

    const shortDesc = description && description.length > 45
        ? description.slice(0, 45).trim() + "…"
        : description || "";

    return (
        <div className="product-card">

            <img src={image} alt={title} className="product-img" onClick={() => onOpenDetail(product)} />

            <h3 className="product-title" onClick={() => onOpenDetail(product)}>{title}</h3>
            <p className="product-brand">{brand}</p>
            <p className="product-desc muted">{shortDesc}</p>

            {oldPrice && discount > 0 ? (
                <div className="price-container">
                    <span className="original-price">{oldPrice.toLocaleString()} so'm</span>
                    <span className="current-price">{price.toLocaleString()} so'm</span>
                </div>
            ) : (
                <p className="product-price">{price.toLocaleString()} so'm</p>
            )}

            <div className="btn-group">
                <button
                    className={`btn ${isInCart ? 'btn--secondary' : 'btn--primary'} add-to-cart-btn`}
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                >
                    {isInCart ? <><i className="fa-solid fa-check"></i> Savatchada</> : "Savatga qo'shish"}
                </button>
                <button className="btn btn--secondary show-detail-btn" onClick={(e) => { e.stopPropagation(); onOpenDetail(product); }}>
                    Ma'lumot
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
