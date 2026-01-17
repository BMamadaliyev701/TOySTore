import React from 'react';
import { useCart } from '../../context/CartContext';

const ProductDetailModal = ({
    selectedProduct,
    activeModal,
    setActiveModal,
    currentImageIndex,
    setCurrentImageIndex,
    isZoomed,
    setIsZoomed,
    handleAddToCart
}) => {
    const { cartItems } = useCart();

    if (activeModal !== 'detail' || !selectedProduct) return null;

    const isInCart = cartItems.some(i => i.id === selectedProduct.id);

    return (
        <>
            <div className="modal-overlay show" onClick={() => setActiveModal(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                    <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div className="product-gallery">
                                <div className="main-image-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', background: '#fff', marginBottom: '15px', cursor: 'pointer' }} onClick={() => setIsZoomed(true)}>
                                    <img
                                        src={selectedProduct.images ? selectedProduct.images[currentImageIndex] : selectedProduct.image}
                                        alt={selectedProduct.title}
                                        style={{ width: '100%', height: '350px', objectFit: 'contain', padding: '20px' }}
                                    />
                                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '5px 10px', borderRadius: '20px', fontSize: '12px' }}>
                                        <i className="fa-solid fa-expand"></i> Kattalashtirish
                                    </div>
                                </div>
                                {selectedProduct.images && selectedProduct.images.length > 0 && (
                                    <div className="thumbnails" style={{ display: 'flex', gap: '10px', justifyContent: 'center', overflowX: 'auto', paddingBottom: '5px' }}>
                                        {selectedProduct.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`thumbnail-${idx}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    border: currentImageIndex === idx ? '2px solid var(--brand)' : '1px solid var(--border)',
                                                    padding: '5px',
                                                    cursor: 'pointer',
                                                    background: '#fff',
                                                    transition: 'all 0.2s'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ flex: '1.2', minWidth: '300px' }}>
                            <h2 style={{ marginBottom: '10px' }}>{selectedProduct.title}</h2>
                            <p className="muted" style={{ marginBottom: '15px' }}>Brend: {selectedProduct.brand}</p>
                            <div style={{ background: 'var(--panel-2)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brand)' }}>{selectedProduct.price.toLocaleString()} so'm</p>
                                {selectedProduct.oldPrice && (
                                    <p className="muted" style={{ textDecoration: 'line-through' }}>{selectedProduct.oldPrice.toLocaleString()} so'm</p>
                                )}
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '10px' }}>Tavsif:</h4>
                                <p style={{ lineHeight: '1.6' }}>{selectedProduct.description}</p>
                            </div>
                            <button
                                className={`btn ${isInCart ? 'btn--secondary' : 'btn--primary'} btn--full`}
                                style={{ gap: '10px' }}
                                onClick={() => handleAddToCart(selectedProduct)}
                            >
                                {isInCart ?
                                    <><i className="fa-solid fa-check"></i> Savatchada</> :
                                    <><i className="fa-solid fa-cart-plus"></i> Savatchaga qo'shish</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kattalashtirilgan rasm modali */}
            {isZoomed && (
                <div className="modal-overlay show" style={{ zIndex: '3000' }} onClick={() => setIsZoomed(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', boxShadow: 'none', maxWidth: '90vw' }}>
                        <span className="close-modal" style={{ color: '#fff', top: '-40px', right: '0' }} onClick={() => setIsZoomed(false)}>&times;</span>
                        <img
                            src={selectedProduct.images ? selectedProduct.images[currentImageIndex] : selectedProduct.image}
                            alt="zoomed"
                            style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '20px', border: '5px solid #fff' }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetailModal;
