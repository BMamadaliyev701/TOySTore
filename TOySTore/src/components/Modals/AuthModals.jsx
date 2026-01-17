

import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthModals = ({ activeModal, setActiveModal, showToast }) => {
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulyatsiya: Foydalanuvchi ma'lumotlarini
        const userData = { name: 'Foydalanuvchi', email: 'user@example.com' };
        login(userData);
        showToast('Tizimga kirish muvaffaqiyatli amalga oshirildi', true, 'bottom');
        setActiveModal(null);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Simulyatsiya: Yangi foydalanuvchi yaratish
        const userData = { name: 'Yangi Foydalanuvchi', email: 'newuser@example.com' };
        login(userData);
        showToast('Ro\'yxatdan o\'tish muvaffaqiyatli yakunlandi', true, 'bottom');
        setActiveModal(null);
    };

    // "Kirish" Modali
    if (activeModal === 'login') {
        return (
            <div className="modal-overlay show" onClick={() => setActiveModal(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <span className="close-modal" onClick={() => setActiveModal(null)} title="Yopish">&times;</span>
                    <h3>Tizimga kirish</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input type="email" placeholder="Email manzilingiz" required />
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="Parolingiz" required />
                        </div>
                        <button type="submit" className="btn btn--primary btn--full">Kirish</button>
                    </form>
                </div>
            </div>
        );
    }

    // "Ro'yxatdan o'tish" Modali
    if (activeModal === 'register') {
        return (
            <div className="modal-overlay show" onClick={() => setActiveModal(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <span className="close-modal" onClick={() => setActiveModal(null)} title="Yopish">&times;</span>
                    <h3>Ro'yxatdan o'tish</h3>
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <input type="text" placeholder="To'liq ismingiz" required />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Email manzilingiz" required />
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="Parol yarating" required />
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="Parolni tasdiqlang" required />
                        </div>
                        <button type="submit" className="btn btn--primary btn--full">Ro'yxatdan o'tish</button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};

export default AuthModals;

