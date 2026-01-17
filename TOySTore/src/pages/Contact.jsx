import React from 'react';

const Contact = () => {
    return (
        <div className="contact-page">
            <main className="container" style={{ padding: '6rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', color: 'var(--brand-2)', marginBottom: '3rem', fontSize: '2.5rem', textTransform: 'uppercase', fontWeight: '800' }}>
                    Bog'lanish
                </h1>
                <form className="contact-form modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--panel)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--muted)' }}>Ismingiz</label>
                        <input type="text" placeholder="Ismingizni kiriting" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--muted)' }}>Email</label>
                        <input type="email" placeholder="Emailingizni kiriting" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--muted)' }}>Xabar</label>
                        <textarea rows="5" placeholder="Xabaringizni yozing" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}></textarea>
                    </div>
                    <button type="submit" className="btn btn--primary btn--full" style={{ padding: '1rem' }}>Yuborish</button>
                </form>

                <div className="contact-info" style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text)' }}>
                    <p style={{ marginBottom: '1rem' }}><i className="fa-solid fa-location-dot" style={{ color: 'var(--brand)', marginRight: '10px' }}></i> <strong>Manzil:</strong> Toshkent shahri, Chilonzor tumani</p>
                    <p style={{ marginBottom: '1rem' }}><i className="fa-solid fa-phone" style={{ color: 'var(--brand)', marginRight: '10px' }}></i> <strong>Telefon:</strong> +998 (94) 849-80-05</p>
                    <p style={{ marginBottom: '1rem' }}><i className="fa-solid fa-envelope" style={{ color: 'var(--brand)', marginRight: '10px' }}></i> <strong>Email:</strong> TOySTore.uz@gmail.com</p>
                </div>
            </main>
        </div>
    );
};

export default Contact;
