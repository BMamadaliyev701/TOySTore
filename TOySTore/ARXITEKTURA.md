# 🏗 TOy STore — Texnik Arxitektura va Tizim Dizayni

Ushbu hujjat **TOy STore** loyihasining texnik arxitekturasi, ma'lumotlar oqimi va dasturlash tamoyillari haqida batafsil ma'lumot beradi. Bu hujjat loyihaning texnik sifatini baholashda asosiy manba bo'lib xizmat qiladi.

## 1. Arxitektura Turi: Component-Based Architecture

Loyiha **React.js** ning "Komponentlarga asoslangan" arxitekturasiga qurilgan. Bu tizimning afzalligi — har bir element mustaqil ishlaydi va qayta ishlatilishi mumkin.

### 🧩 Komponentlar Ierarxiyasi:
-   **Atomic Components**: `ProductCard`, `Button` kabi kichik qismlar.
-   **Structural Components**: `Navbar`, `Footer` kabi sahifa qobig'ini yaratuvchi qismlar.
-   **Page Components**: `Home`, `About`, `Contact` kabi to'liq sahifalar.
-   **Modal Components**: `CartModal`, `AuthModals` kabi foydalanuvchi bilan interaktiv aloqa qiluvchi qatlamlar.

## 2. Ma'lumotlarni Boshqarish (State Management)

Loyihada **React Context API** texnologiyasidan foydalanilgan. Bu orqali "Single Source of Truth" (Yagona ma'lumot manbai) tamoyili amalga oshirilgan.

### 🧠 Tizim Context'lari:
-   **CartContext**: Savatchadagi mahsulotlar, ularning soni va umumiy summani real vaqtda hisoblab boradi.
-   **AuthContext**: Foydalanuvchi tizimga kirganligini tekshiradi va profil ma'lumotlarini boshqaradi.
-   **ThemeContext**: Butun saytning ko'rinishini (Dark/Light mode) bir soniyada o'zgartirish va holatni `localStorage` da saqlashga xizmat qiladi.

## 3. Navigatsiya va Routing

**React Router Dom** yordamida "Declarative Routing" qo'llanilgan. Bu Single Page Application (SPA) uchun eng xavfsiz va samarali usuldir.

-   `/` — Bosh sahifa (Katalog va filtrlar).
-   `/about` — Sayt va jamoa haqida ma'lumot.
-   `/contact` — Bog'lanish va manzillar.

## 4. Dizayn Tizimi (Design System)

Loyihada **Vanilla CSS** va **CSS Custom Properties** (Sifatli o'zgaruvchilar) ishlatilgan. Bu tema almashish jarayonini nihoyatda osonlashtiradi.

-   **Color Palette**: HSL rang tizimi asosida yasalgan premium ranglar.
-   **Glassmorphism**: Shaffoflik va xiralashgan fon (backdrop-filter) yordamida zamonaviy ko'rinish berilgan.
-   **Responsiveness**: CSS `clamp()`, `grid` va `flexbox` texnologiyalari orqali barcha qurilmalarga moslangan.

## 5. Ma'lumotlar Oqimi (Data Flow)

1.  Mahsulotlar ma'lumotlari `public/data/products.json` faylidan `fetch()` orqali olinadi.
2.  `Home.jsx` sahifasida bu ma'lumotlar filtr va qidiruv logikasidan o'tadi.
3.  Tanlangan mahsulot `CartContext` orqali savatchaga qo'shiladi.
4.  Barcha o'zgarishlar foydalanuvchi tushunishi uchun oniy bildirishnomalar (`Toasts`) orqali tasdiqlanadi.

## 6. Xavfsizlik va Optimizatsiya

-   **Form Validation**: Kirish va buyurtma berish formalarida ma'lumotlar to'g'riligi tekshiriladi.
-   **Performance**: Rasmlar optimallashgan formatda va Vite yordamida statik fayllar tezkor servis qilinadi.
-   **Accessibility**: Semantik HTML teglaridan (`header`, `main`, `footer`, `section`) foydalanilgan.

---
*Loyiha diplom ishi talablariga to'liq javob beradigan professional darajadagi dasturiy mahsulotdir.* 🏛️
