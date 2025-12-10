# TOy STore - O'yinchoq Do'koni

## Loyiha Tavsifi
TOy STore - bu bolalar uchun sifatli o'yinchoqlarni taklif qiluvchi onlayn-do'kon. Sayt bolalarda ijodiy fikrlashni, sabr-toqatni va mantiqiy fikrlashni rivojlantiruvchi o'yinchoqlarni yetkazib beradi.

## Asosiy Xususiyatlar
1. **To'liq mobil qo'llab-quvvatlash** - Barcha qurilmalarda muammosiz ishlaydi
2. **Dark/Light tema** - Foydalanuvchilar qulayligi uchun ikkala mavzu
3. **Keng mahsulot assortimenti** - 10+ turdagi o'yinchoqlar
4. **Oson qidiruv va filtr** - Kategoriya bo'yicha tez filtr
5. **Savat tizimi** - Mahsulotlarni saqlash va miqdorni boshqarish
6. **Xavfsiz buyurtma berish** - To'lov usullari va ma'lumotlar himoyasi
7. **Yangiliklar va Xit savdo** - Eng yangi va mashhur mahsulotlar

## Texnologiyalar
- **HTML5** - Semantik struktur
- **CSS3** - Modern dizayn va animatsiyalar
- **JavaScript (ES6+)** - Dinamik funksionallik
- **Font Awesome** - Ikonkalar uchun
- **LocalStorage** - Mahalliy ma'lumotlar saqlash

## Sayt Strukturasi

### 1. Header (Sarlavha)
- Logo va sayt nomi
- Qidiruv paneli
- Tema o'zgartirish tugmasi
- Savat ikonkasi
- Foydalanuvchi autentifikatsiyasi

### 2. Banner (Reklama)
- Asosiy rasm va matn
- Katalogga o'tish tugmasi
- Responsive dizayn

### 3. Navigatsiya Panel
- Kategoriyalar
- Tezkor havolalar (Yangiliklar, Xit savdo, Biz haqimizda, Kontaktlar)
- Kirish/Ro'yxatdan o'tish tugmalari

### 4. Filtrlar
- Barcha mahsulotlar
- 7 asosiy kategoriya
- Yangiliklar
- Xit savdo

### 5. Mahsulotlar Katalogi
- 2x2 yoki 4x1 grid (ekran o'lchamiga qarab)
- Har bir mahsulot uchun:
  - Rasm
  - Nomi va brendi
  - Tavsifi
  - Narxi (chegirmalar bilan)
  - Badgelar (YANGI, HIT, CHEGIRMA)
  - Savatga qo'shish/Ma'lumot tugmalari

### 6. Mahsulot Detallari
- Slider bilan ko'p rasmlar
- Batafsil ma'lumotlar
- Kategoriya va brend
- Narx va chegirma

### 7. Biz Haqimizda
- Kompaniya maqsadi
- Bolalar rivojlanishi haqida ma'lumot
- Responsive dizayn

### 8. Brendlar
- Hamkor brendlar logotiplari
- Grid ko'rinishi
- Hover effektlari

### 9. Footer (Pastki qism)
- Kontakt ma'lumotlari (telefon, email)
- Ijtimoiy tarmoqlar
- To'lov usullari (Payme, Uzum Bank, Naqd pul)
- Toifalar bo'yicha navigatsiya
- Umumiy navigatsiya
- Muallif haqida ma'lumot

### 10. Modallar
- **Kirish modal** - Email va parol orqali kirish
- **Ro'yxatdan o'tish modal** - Yangi foydalanuvchi yaratish
- **Savat modal** - Tanlangan mahsulotlar ro'yxati
- **Buyurtma modal** - Yetkazib berish ma'lumotlari
- **Mahsulot detallari modal** - Batafsil ma'lumot va rasm slayder

### 11. Toast Xabarlar
- Yuqori va pastki xabarlar
- 4 turdagi xabarlar (success, error, info, warning)
- Progress bar bilan
- 3 soniya davomida ko'rinadi

## Funksionallik
1. **Mahsulotlar Filtri** - Kategoriya, yangiliklar va xit savdo bo'yicha filtr
2. **Qidiruv** - Nom, brend va narx bo'yicha qidiruv
3. **Savat** - Mahsulot qo'shish, miqdorni o'zgartirish, o'chirish
4. **Buyurtma Berish** - Ma'lumotlarni to'ldirish va to'lov usulini tanlash
5. **Foydalanuvchi Hisobi** - Kirish va ro'yxatdan o'tish
6. **Tema O'zgartirish** - Qorong'i va yorug' mavzu
7. **Mobil Optimallashtirish** - Barcha ekran o'lchamlari uchun moslashuvchan

## Mobil Optimallashtirish
- **768px dan kichik**:
  - 2 ustunli mahsulotlar
  - Kattalashtirilgan tugmalar va inputlar
  - Stack navbarlar
  - Kichikroq banner
  
- **480px dan kichik**:
  - 2 ustunli mahsulotlar (harakat qulayligi uchun)
  - Kichikroq fontlar
  - Sifrlangan padding/margin
  - Optimallashtirilgan modallar

## O'rnatish va Ishlatish
1. Fayllarni yuklab oling
2. `index.html` ni oching
3. Brauzerda localhost orqali ishlating
4. Mahsulotlar `products.json` faylida saqlanadi
5. Foydalanuvchilar va savat `localStorage` da saqlanadi

## Muallif
- **Ism**: B.Mamadaliyev
- **Vazifa**: O'yinchoq do'koni uchun to'liq funksionallikli veb-sayt
- **Texnologiyalar**: HTML, CSS, JavaScript
- **Sana**: 2025

## Litsenziya

Ushbu loyiha ochiq manba hisoblanadi. Har qanday o'zgartirishlar kiritish mumkin.

toy-store/
├── index.html      # 700+ qator (barcha HTML)
├── style.css       # 1200+ qator (barcha CSS)
├── script.js       # 1000+ qator (barcha JavaScript)
├── products.json   # Mahsulotlar
└── README.md       # Dokumentatsiya

css/
├── base/
│   ├── variables.css    # :root va body.light-mode
│   ├── reset.css        # *, html, body, container
│   └── typography.css   # .muted, .error-message
├── components/
│   ├── buttons.css      # .btn va varianti
│   ├── cards.css        # .product-card
│   ├── modal.css        # .modal-overlay
│   └── toast.css        # .toast
├── layout/
│   ├── header.css       # .topbar, .logo
│   ├── footer.css       # footer, .footer-columns
│   └── grid.css         # .products grid
└── main.css             # Asosiy import
