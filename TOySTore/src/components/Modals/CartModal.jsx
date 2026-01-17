import React from 'react';
import { useCart } from '../../context/CartContext';

const CartModal = ({ activeModal, setActiveModal, showToast }) => {
    const { cartItems, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        showToast('Buyurtmangiz qabul qilindi! Tez orada bog\'lanamiz.', true, 'bottom');
        clearCart();
        setActiveModal(null);
    };

    if (activeModal === 'cart') {
        return (
            <div className="modal-overlay show" onClick={() => setActiveModal(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Sizning savatingiz</h3>
                    <div className="cart-items-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {cartItems.length === 0 ? (
                            <div style={{ padding: '40px 0' }}>
                                <i className="fa-solid fa-cart-shopping muted" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', textAlign: 'center' }}></i>
                                <p className="muted text-center">Savatingiz hozircha bo'sh</p>
                            </div>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                                    <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', background: '#fff' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600', marginBottom: '5px' }}>{item.title}</p>
                                        <p style={{ color: 'var(--brand)', fontWeight: '700' }}>{item.price.toLocaleString()} so'm</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--panel-2)', padding: '5px 10px', borderRadius: '20px' }}>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0 5px' }} onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0 5px' }} onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <button style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => removeFromCart(item.id)}>&times;</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px' }}>
                                <span>Jami:</span>
                                <span>{totalAmount.toLocaleString()} so'm</span>
                            </div>
                            <button className="btn btn--primary btn--full" onClick={() => setActiveModal('order')}>
                                Buyurtma berish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (activeModal === 'order') {
        return (
            <div className="modal-overlay show" onClick={() => setActiveModal(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                    <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
                    <h3 style={{ marginBottom: '20px' }}>Buyurtmani rasmiylashtirish</h3>
                    <form onSubmit={handleOrderSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Ism va Familiya</label>
                            <input type="text" placeholder="Ismingizni kiriting" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel-2)', color: 'var(--text)' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Telefon raqami</label>
                            <input type="tel" placeholder="+998" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel-2)', color: 'var(--text)' }} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Manzil</label>
                            <textarea placeholder="Yetkazib berish manzili" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel-2)', color: 'var(--text)', minHeight: '80px', resize: 'vertical' }}></textarea>
                        </div>
                        <div style={{ background: 'var(--panel-2)', padding: '15px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Umumiy summa:</span>
                            <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>{totalAmount.toLocaleString()} so'm</span>
                        </div>
                        <button type="submit" className="btn btn--primary btn--full">Buyurtmani tasdiqlash</button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};

export default CartModal;
