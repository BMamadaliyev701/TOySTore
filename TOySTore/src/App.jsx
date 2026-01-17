

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import CartModal from './components/Modals/CartModal';
import ProductDetailModal from './components/Modals/ProductDetailModal';
import AuthModals from './components/Modals/AuthModals';

import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

const App = () => {
    const { cartItems, cartCount, addToCart } = useCart();
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();


    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [toasts, setToasts] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
    const [tempPrice, setTempPrice] = useState({ min: '', max: '' });

    const navigate = useNavigate();

    const showToast = (message, success = true, position = 'bottom') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, success, position }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 2500);
    };

    const handleModalOpen = (type, data = null) => {
        if (type === 'detail') {
            setSelectedProduct(data);
            setCurrentImageIndex(0);
        }
        setActiveModal(type);
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        navigate('/'); // Kategoriya o'zgarganda bosh sahifaga yo'naltirish

        // Katalog qismiga avtomatik skroll qilish
        setTimeout(() => {
            document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Agar "Barchasi" tanlansa, qidiruv va narx filtrlarini tozalash
        if (category === 'all') {
            setSearchTerm('');
            setPriceRange({ min: 0, max: Infinity });
            setTempPrice({ min: '', max: '' });
        }
    };

    return (
        <div className="app">
            {/* Navigatsiya paneli */}
            <Navbar
                cartCount={cartCount}
                onThemeToggle={toggleTheme}
                isDarkMode={isDarkMode}
                onModalOpen={handleModalOpen}
                onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    if (val) navigate('/');
                }}
                onCategoryChange={handleCategoryChange}
                user={user}
                onLogout={() => {
                    logout();
                    showToast("Tizimdan chiqildi", true, 'bottom');
                }}
            />

            {/* Asosiy sahifalar navigatsiyasi */}
            <Routes>
                <Route path="/" element={
                    <Home
                        onAddToCart={(p) => {
                            addToCart(p);
                            showToast(`${p.title} savatga qo'shildi!`, true, 'bottom');
                        }}
                        onModalOpen={handleModalOpen}
                        searchTerm={searchTerm}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                        cartItems={cartItems}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        tempPrice={tempPrice}
                        setTempPrice={setTempPrice}
                    />
                } />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>

            {/* Saytning pastki qismi */}
            <Footer
                onCategoryChange={handleCategoryChange}
                onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
            />

            {/* Toast Bildirishnomalar Konteyneri */}
            <div className="toast-container">
                {toasts.filter(t => t.position === 'top').map(t => (
                    <div key={t.id} className={`toast show ${t.success ? 'success' : 'error'}`}>{t.message}</div>
                ))}
            </div>
            <div className="toast-container-bottom">
                {toasts.filter(t => t.position === 'bottom').map(t => (
                    <div key={t.id} className={`toast show ${t.success ? 'success' : 'error'}`}>{t.message}</div>
                ))}
            </div>

            {/* Modallar To'plami */}
            <CartModal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                showToast={showToast}
            />

            <ProductDetailModal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                selectedProduct={selectedProduct}
                handleAddToCart={(p) => {
                    addToCart(p);
                    showToast(`${p.title} savatga qo'shildi!`, true, 'bottom');
                }}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                isZoomed={isZoomed}
                setIsZoomed={setIsZoomed}
            />

            <AuthModals
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                showToast={showToast}
            />
        </div>
    );
};

export default App;


