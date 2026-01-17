import React, { useState, useEffect } from 'react';
import Brands from '../components/Brands/Brands';
import ProductCard from '../components/ProductCard/ProductCard';
import { useCart } from '../context/CartContext';
import './Home.css';

const Home = ({
    onAddToCart,
    onModalOpen,
    searchTerm,
    activeCategory,
    onCategoryChange,
    priceRange,
    setPriceRange,
    tempPrice,
    setTempPrice
}) => {
    const [products, setProducts] = useState([]);
    const { cartItems } = useCart();

    useEffect(() => {
        fetch('/data/products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Mahsulotlarni yuklashda xatolik:", err));
    }, []);

    const filteredProducts = products.filter(product => {
        if (activeCategory === 'new') {
            if (!product.isNew) return false;
        } else if (activeCategory === 'hit') {
            if (!product.isHit || product.isNew) return false;
        } else if (activeCategory !== 'all') {
            if (product.category !== activeCategory) return false;
        }

        if (searchTerm) {
            const search = searchTerm.toLowerCase().trim();
            const matches = product.title.toLowerCase().includes(search) ||
                product.brand.toLowerCase().includes(search) ||
                product.price.toString().includes(search);
            if (!matches) return false;
        }

        const min = priceRange.min || 0;
        const max = priceRange.max || Infinity;
        if (product.price < min || product.price > max) return false;

        return true;
    });

    const handlePriceApply = () => {
        setPriceRange({
            min: tempPrice.min ? parseFloat(tempPrice.min) : 0,
            max: tempPrice.max ? parseFloat(tempPrice.max) : Infinity
        });
    };

    return (
        <div className="home-page">

            {!searchTerm && (
                <section className="banner" id="banner">
                    <div className="container">
                        <div className="banner-content">
                            <h1 className="banner-title">Eng sara O'yinchoqlar siz uchun</h1>
                            <p className="banner-description">Siz hohlagan o'yinchoqlar</p>
                            <a href="#catalog-anchor" className="btn btn--primary scroll-to-products" onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                Maxsulotlar
                            </a>
                        </div>
                        <div className="banner-image">
                            <img src="https://i.postimg.cc/hPdb4CGJ/unnamed.jpg" alt="O'yinchoqlar banneri" />
                        </div>
                    </div>
                </section>
            )}

            <main className="container">
                <div id="catalog-anchor"></div>

                <div className="main-shop-layout">

                    <aside className="shop-sidebar">
                        <div className="filter-container" id="filterContainer">
                            <h3 className="filter-title">Filtrlar</h3>

                            <div className="price-filter-sidebar">
                                <label>Narx oralig'i</label>
                                <div className="price-inputs-row">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="price-input"
                                        value={tempPrice.min}
                                        onChange={(e) => setTempPrice({ ...tempPrice, min: e.target.value })}
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="price-input"
                                        value={tempPrice.max}
                                        onChange={(e) => setTempPrice({ ...tempPrice, max: e.target.value })}
                                    />
                                </div>
                                <button className="btn btn--secondary btn--sm btn--full" onClick={handlePriceApply}>OK</button>
                            </div>

                            <div className="filter-options vertical" id="filterOptions">
                                {[
                                    { id: 'all', label: "Barcha o'yinchoqlar" },
                                    { id: 'new', label: "Yangiliklar", icon: 'fa-solid fa-newspaper' },
                                    { id: 'hit', label: "Xit savdo", icon: 'fa-solid fa-fire' },
                                    { separator: true },
                                    { id: 'Konstruktor', label: "Konstruktorlar" },
                                    { id: "Qo'g'irchoqlar", label: "Qo'g'irchoqlar" },
                                    { id: "Yumshoq o'yinchoqlar", label: "Yumshoq o'yinchoqlar" },
                                    { id: 'Mashinalar', label: "Mashinalar" },
                                    { id: "Ta'limiy", label: "Ta'limiy" },
                                    { id: 'Jumboqlar', label: "Jumboqlar" },
                                    { id: 'Figuralar', label: "Figuralar" }
                                ].map((item, idx) => (
                                    item.separator ? <hr key={idx} className="filter-divider" /> : (
                                        <div
                                            key={item.id}
                                            className={`filter-item ${activeCategory === item.id ? 'active' : ''}`}
                                            onClick={() => onCategoryChange(item.id)}
                                        >
                                            {item.icon && <i className={item.icon}></i>} {item.label}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="products-wrapper">

                        {filteredProducts.length === 0 && (
                            <div className="no-results text-center py-10" style={{ textAlign: 'center', padding: '3rem', width: '100%' }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '1rem' }}></i>
                                <p style={{ color: 'var(--text)', fontSize: '1.2rem' }}>Hech narsa topilmadi</p>
                            </div>
                        )}

                        <div className="products" id="toy-list">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    onOpenDetail={(p) => onModalOpen('detail', p)}
                                    isInCart={cartItems && cartItems.some(item => item.id === product.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <div className="showcase-group" style={{ background: 'var(--panel)', padding: '60px 0', marginTop: '60px', borderTop: '1px solid var(--border)' }}>
                <section id="about" className="container">
                    <div className="about-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 className="section-title-premium">BIZ HAQIMIZDA</h2>
                        <div className="about-text-premium" style={{ fontSize: '1.2rem', lineHeight: '1.9', color: 'var(--text)', opacity: '0.9' }}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--brand)', fontWeight: 'bold', fontSize: '1.4rem' }}>TOy STore</span> — bu shunchaki o'yinchoqlar do'koni emas, balki bolalarning kelajagi uchun sarmoyadir. Biz
                                bolalarda <b style={{ color: 'var(--brand-2)' }}>ijodiy fikrlash</b>, <b style={{ color: 'var(--brand-2)' }}>mantiq</b> va <b style={{ color: 'var(--brand-2)' }}>tasavvur</b>ni rivojlantiruvchi eng sifatli va foydali mahsulotlarni taklif etamiz.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="brands-showcase container" id="brands" style={{ marginTop: '80px' }}>
                    <h2 className="section-title-premium">HAMKOR BRENDLAR</h2>
                    <Brands onBrandClick={(brand) => console.log("Brand clicked:", brand)} />
                </section>
            </div>
        </div>
    );
};

export default Home;
