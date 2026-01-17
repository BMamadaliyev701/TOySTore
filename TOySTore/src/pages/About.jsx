import React from 'react';

const About = () => {
    return (
        <div className="about-page">
            <main className="container" style={{ padding: '6rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', color: 'var(--brand-2)', marginBottom: '3rem', fontSize: '2.5rem', textTransform: 'uppercase', fontWeight: '800' }}>
                    Biz Haqimizda
                </h1>
                <div className="about-content" style={{ lineHeight: '1.8', fontSize: '1.2rem', color: 'var(--text)' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ color: 'var(--brand)' }}>TOy STore</strong> — bolalar dunyosiga sehr va quvonch olib kiruvchi do'kon.
                        Bizning maqsadimiz nafaqat o'yinchoq sotish, balki har bir bolaning rivojlanishiga
                        hissa qo'shadigan, ularning fantaziyasini boyitadigan sifatli mahsulotlarni yetkazib berishdir.
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Biz barcha mahsulotlarimizni dunyoning eng yetakchi ishlab chiqaruvchilaridan (LEGO, Mattel va boshqalar)
                        to'g'ridan-to'g'ri olib kelamiz. Har bir o'yinchoq xavfsizlik standartlariga javob beradi va
                        ekologik toza materiallardan tayyorlangan.
                    </p>
                    <h2 style={{ marginTop: '3rem', color: 'var(--brand-2)', marginBottom: '1.5rem' }}>Bizning Qadriyatlarimiz:</h2>
                    <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.8rem' }}><i className="fa-solid fa-check" style={{ color: 'var(--success)', marginRight: '10px' }}></i> Sifat va Xavfsizlik</li>
                        <li style={{ marginBottom: '0.8rem' }}><i className="fa-solid fa-check" style={{ color: 'var(--success)', marginRight: '10px' }}></i> Innovatsion yondashuv</li>
                        <li style={{ marginBottom: '0.8rem' }}><i className="fa-solid fa-check" style={{ color: 'var(--success)', marginRight: '10px' }}></i> Mijozlar ishonchi</li>
                        <li style={{ marginBottom: '0.8rem' }}><i className="fa-solid fa-check" style={{ color: 'var(--success)', marginRight: '10px' }}></i> Bolalar tabassumi</li>
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default About;
