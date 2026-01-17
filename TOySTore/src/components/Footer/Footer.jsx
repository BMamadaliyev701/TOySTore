import React from 'react';
import './Footer.css';


const Footer = ({ onCategoryChange, onNavigate }) => {

    const handleCat = (e, cat) => {
        e.preventDefault();
        onCategoryChange(cat);
        // Katalog qismiga silliq tushish
        document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNav = (e, page, anchor = null) => {
        e.preventDefault();
        onNavigate(page);
        if (anchor) {
            setTimeout(() => {
                document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer-grid">

                    {/* 1-Ustun: Sayt haqida ma'lumot */}
                    <div className="footer-info">
                        <div className="footer-logo">
                            <img src="https://i.postimg.cc/mrC7Bh2G/Bez-nazvania.png" alt="ToyStore Logo" />
                            <span>TOy STore</span>
                        </div>
                        <p className="footer-desc">
                            Biz bolalarning tasavvur dunyosini boyitish va ularga quvonch ulashish uchun sifatli va xavfsiz o'yinchoqlarni taqdim etamiz. O'yin orqali o'rganish — bizning asosiy maqsadimiz!
                        </p>
                        <div className="social-links">
                            <a href="https://t.me/toystore_uz" target="_blank" rel="noopener noreferrer" title="Telegram">
                                <i className="fa-brands fa-telegram-plane"></i>
                            </a>
                            <a href="https://instagram.com/toystore.uz" target="_blank" rel="noopener noreferrer" title="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" title="YouTube">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                    {/* 2-Ustun: Navigatsiya havolalari */}
                    <div className="footer-links">
                        <h4>Navigatsiya</h4>
                        <ul>
                            <li><a href="#" onClick={(e) => handleNav(e, 'home')}>Bosh sahifa</a></li>
                            <li><a href="#" onClick={(e) => handleNav(e, 'home', 'catalog-anchor')}>Katalog</a></li>
                            <li><a href="#" onClick={(e) => handleNav(e, 'home', 'about')}>Biz haqimizda</a></li>
                            <li><a href="#footer" onClick={(e) => handleNav(e, 'home', 'footer')}>Kontaktlar</a></li>
                        </ul>
                    </div>

                    {/* 3-Ustun: Mahsulot toifalari */}
                    <div className="footer-links">
                        <h4>Toifalar</h4>
                        <ul>
                            <li><a href="#" onClick={(e) => handleCat(e, 'all')}>Barcha mahsulotlar</a></li>
                            <li><a href="#" onClick={(e) => handleCat(e, 'Konstruktor')}>Konstruktorlar</a></li>
                            <li><a href="#" onClick={(e) => handleCat(e, 'new')}>Yangiliklar</a></li>
                            <li><a href="#" onClick={(e) => handleCat(e, 'hit')}>Xit savdo</a></li>
                        </ul>
                    </div>

                    {/* 4-Ustun: Kontaktlar */}
                    <div className="footer-contact">
                        <h4>Kontaktlar</h4>
                        <ul>
                            <li>
                                <i className="fa-solid fa-location-dot"></i>
                                <span>Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 15-uy</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-phone"></i>
                                <a href="tel:+998948498005" style={{ color: 'inherit', textDecoration: 'none' }}>+998 (94) 849-80-05</a>
                            </li>
                            <li>
                                <i className="fa-solid fa-envelope"></i>
                                <a href="mailto:toystore.uz@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>toystore.uz@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Pastki qismi */}
                <div className="footer-bottom">
                    <p>&copy; 2026 TOy STore — O'yinchoqlar do'koni. Barcha huquqlar himoyalangan.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

