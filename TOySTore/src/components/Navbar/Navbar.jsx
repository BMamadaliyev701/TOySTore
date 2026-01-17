

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onModalOpen, onNavigate, searchTerm, onSearchChange, onCategoryChange, onLogout }) => {
    const { cartCount } = useCart();
    const { user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


    const handleNav = (page, anchor) => {
        onNavigate(page);
        setIsMenuOpen(false); // Menyu ochiq bo'lsa yopish

        if (anchor) {
            setTimeout(() => {
                document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    const handleCat = (cat) => {
        onCategoryChange(cat);
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Topbar: Logo, Qidiruv va Asosiy tugmalar */}
            <header className="topbar">
                <div className="container">
                    <div className="topbar__inner">
                        <div className="top-row">
                            {/* Mobil Menu Tugmasi */}
                            <button className="burger-menu" onClick={toggleMenu} aria-label="Menu">
                                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                            </button>

                            {/* Brend Logotipi */}
                            <Link to="/" className="logo scroll-to-top" onClick={() => handleNav('home')}>
                                <img src="https://i.postimg.cc/mrC7Bh2G/Bez-nazvania.png" alt="TOy STore logo" className="logo-dark" />
                                <img src="https://i.postimg.cc/mrC7Bh2G/Bez-nazvania.png" alt="TOy STore logo" className="logo-light" />
                                TOy STore
                            </Link>

                            {/* Foydalanuvchi Amallari (Tema va Savatcha) */}
                            <div className="actions">
                                <button id="theme-toggle" className="action" onClick={toggleTheme} title="Mavzuni o'zgartirish">
                                    {!isDarkMode ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
                                </button>
                                <button id="cart-btn" className="action" onClick={() => onModalOpen('cart')} title="Savatcha">
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    <span id="cart-count" className="cart-count">{cartCount}</span>
                                </button>
                            </div>
                        </div>

                        {/* Qidiruv Maydoni */}
                        <div className="search">
                            <input
                                type="text"
                                id="searchInput"
                                placeholder="O'yinchoqlar nomi, brendi..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>

                        {/* Avtorizatsiya Tugmalari (Mobil uchun) */}
                        <div className="mobile-auth-row">
                            {user ? (
                                <button className="btn btn--secondary btn--sm" onClick={onLogout}>Chiqish</button>
                            ) : (
                                <>
                                    <button className="btn btn--secondary btn--sm" onClick={() => onModalOpen('login')}>Kirish</button>
                                    <button className="btn btn--primary btn--sm" onClick={() => onModalOpen('register')}>Ro'yxatdan o'tish</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Asosiy Navigatsiya Paneli (Nav menyu) */}
            <nav className={`secondary-navbar ${isMenuOpen ? 'mobile-open' : ''}`} id="sidebar-menu">
                <button className="close-sidebar" onClick={() => setIsMenuOpen(false)}>&times;</button>
                <div className="navbar-content">
                    <ul className="quick-links-list">
                        <li>
                            <Link to="/" className="nav-link scroll-to-top" onClick={() => handleNav('home')}>Bosh sahifa</Link>
                        </li>

                        {/* Katalog Dropdown Menyu */}
                        <li className="dropdown">
                            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
                                Katalog <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.8em', marginLeft: '5px' }}></i>
                            </a>
                            <div className="dropdown-content">
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('all'); }}>Barcha o'yinchoqlar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('Konstruktor'); }}>Konstruktorlar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat("Qo'g'irchoqlar"); }}>Qo'g'irchoqlar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat("Yumshoq o'yinchoqlar"); }}>Yumshoq o'yinchoqlar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('Mashinalar'); }}>Mashinalar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat("Ta'limiy"); }}>Ta'limiy</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('Jumboqlar'); }}>Jumboqlar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('Figuralar'); }}>Figuralar</a>
                                <hr />
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('new'); }}><i className="fa-solid fa-newspaper"></i> Yangiliklar</a>
                                <a href="#filterContainer" onClick={(e) => { e.preventDefault(); handleCat('hit'); }}><i className="fa-solid fa-fire"></i> Xit savdo</a>
                            </div>
                        </li>

                        <li className="separator">|</li>
                        <li><Link to="/" className="nav-link" onClick={() => handleNav('home', 'about')}>Biz haqimizda</Link></li>
                        <li><Link to="/" className="nav-link" onClick={() => handleNav('home', 'footer')}>Kontaktlar</Link></li>
                    </ul>

                    {/* Foydalanuvchi Profili Amallari */}
                    <div className="user-actions">
                        {user ? (
                            <button className="btn btn--secondary" onClick={onLogout}>Chiqish</button>
                        ) : (
                            <>
                                <button className="btn btn--secondary" onClick={() => { onModalOpen('login'); setIsMenuOpen(false); }}>Kirish</button>
                                <button className="btn btn--primary" onClick={() => { onModalOpen('register'); setIsMenuOpen(false); }}>Ro'yxatdan o'tish</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;


