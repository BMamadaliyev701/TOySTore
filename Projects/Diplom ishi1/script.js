// =================================================================
// TOy STore - Barcha funksionallik bitta faylda
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    // =================================================================
    // 1. ELEMENTLARNI TOPISH VA SAQLASH
    // =================================================================
    const els = {
        toyList: document.getElementById("toy-list"),
        filterOptions: document.getElementById("filterOptions"),
        searchInput: document.getElementById("searchInput"),
        banner: document.getElementById("banner"),

        themeToggle: document.getElementById("theme-toggle"),
        toastContainer: document.getElementById("toast-container"),
        toastContainerBottom: document.getElementById("toast-container-bottom"),
        loaderOverlay: document.getElementById("loader"),

        modals: document.querySelectorAll(".modal-overlay"),
        loginModal: document.getElementById("login-modal"),
        registerModal: document.getElementById("register-modal"),
        cartModal: document.getElementById("cart-modal"),
        orderModal: document.getElementById("order-modal"),
        detailModal: document.getElementById("toy-detail-modal"),

        detailImage: document.getElementById("detail-image"),
        detailTitle: document.getElementById("detail-title"),
        detailBrand: document.getElementById("detail-brand"),
        detailCategory: document.getElementById("detail-category"),
        detailPrice: document.getElementById("detail-price"),
        detailDescription: document.getElementById("detail-description"),
        toyDetailsList: document.getElementById("toy-details-list"),

        cartBtn: document.getElementById("cart-btn"),
        cartCount: document.getElementById("cart-count"),
        cartItemsList: document.getElementById("cart-items-list"),
        cartTotalPrice: document.getElementById("cart-total-price"),
        orderAllBtn: document.getElementById("order-all-btn"),

        orderForm: document.getElementById("order-form"),
        orderMessage: document.getElementById("order-message"),
        orderToyInfo: document.getElementById("order-toy-info"),

        loginForm: document.getElementById("login-form"),
        registerForm: document.getElementById("register-form"),
        loginMessage: document.getElementById("login-message"),
        registerMessage: document.getElementById("register-message"),

        userActions: document.querySelector(".user-actions"),
        userInfo: document.querySelector(".user-info"),
        userDisplayEmail: document.getElementById("user-display-email"),
        logoutBtn: document.getElementById("logout-btn"),

        scrollToTop: document.querySelectorAll(".scroll-to-top"),
        scrollToProducts: document.querySelectorAll(".scroll-to-products"),
    };

    // =================================================================
    // 2. MA'LUMOTLAR SAQLASH VA BOSHQARISH
    // =================================================================
    const store = {
        toys: [],
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        users: JSON.parse(localStorage.getItem("users")) || [],
        theme: localStorage.getItem("theme") || "dark",
        language: localStorage.getItem("language") || "uz",

        // =================================================================
        // 2.1 MAHSULOTLARNI YUKLASH
        // =================================================================
        async load() {
            try {
                const res = await fetch("./products.json");
                if (!res.ok) throw new Error("products.json yuklanmadi");
                const data = await res.json();
                this.toys = Array.isArray(data) ? data : [];
                localStorage.setItem("toys", JSON.stringify(this.toys));
            } catch (err) {
                console.error("Mahsulotlar yuklanmadi:", err);
                this.toys = JSON.parse(localStorage.getItem("toys")) || [];
            }
        },

        // =================================================================
        // 2.2 MA'LUMOTLARNI SAQLASH
        // =================================================================
        save() {
            localStorage.setItem("cart", JSON.stringify(this.cart));
            localStorage.setItem("users", JSON.stringify(this.users));
            localStorage.setItem("theme", this.theme);
            localStorage.setItem("language", this.language);
        },

        // =================================================================
        // 2.3 SAVATGA QO'SHISH
        // =================================================================
        addToCart(id) {
            const toyId = Number(id);
            const toy = this.toys.find((b) => b.id === toyId);
            if (!toy) return;

            const exist = this.cart.find((i) => i.id === toyId);
            if (exist) {
                exist.quantity++;
            } else {
                this.cart.push({ ...toy, quantity: 1 });
            }
            this.save();
            ui.renderCart();
            ui.renderToys(this.getFiltered());
            ui.showToast(`${toy.title} savatga qo'shildi!`, true, "top");
        },

        // =================================================================
        // 2.4 SAVATDAN OLIB TASHLASH
        // =================================================================
        removeFromCart(id) {
            const toyId = Number(id);
            this.cart = this.cart.filter((i) => i.id !== toyId);
            this.save();
            ui.renderCart();
            ui.renderToys(this.getFiltered());
            ui.showToast("Mahsulot savatdan olib tashlandi", true, "top");
        },

        // =================================================================
        // 2.5 MIQDORNI YANGILASH
        // =================================================================
        updateQuantity(id, delta) {
            const toyId = Number(id);
            const item = this.cart.find((i) => i.id === toyId);
            if (!item) return;

            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(toyId);
            } else {
                this.save();
            }
            ui.renderCart();
            ui.renderToys(this.getFiltered());
        },

        // =================================================================
        // 2.6 JAMI NARX
        // =================================================================
        getTotal() {
            return this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        },

        // =================================================================
        // 2.7 FOYDALANUVCHI MA'LUMOTLARI
        // =================================================================
        getLoggedInUser() {
            return JSON.parse(localStorage.getItem("loggedInUser"));
        },

        setLoggedInUser(user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
        },

        logout() {
            localStorage.removeItem("loggedInUser");
        },

        // =================================================================
        // 2.8 FILTRLANGAN MAHSULOTLAR
        // =================================================================
        getFiltered() {
            const activeFilter =
                document.querySelector(".filter-item.active")?.dataset.filter || "all";
            const search = (els.searchInput.value || "").toLowerCase().trim();

            return this.toys.filter((b) => {
                const matchesFilter =
                    activeFilter === "all" ||
                    String(b.category || "").toLowerCase() === activeFilter.toLowerCase();

                const matchesSearch =
                    !search ||
                    b.title.toLowerCase().includes(search) ||
                    (b.brand || "").toLowerCase().includes(search) ||
                    String(b.price).includes(search);

                return matchesFilter && matchesSearch;
            });
        },
    };

    // =================================================================
    // 3. INTERFEYS BOSHQARUVI
    // =================================================================
    const ui = {
        // =================================================================
        // 3.1 MAHSULOTLARNI CHIQARISH
        // =================================================================
        renderToys(toys = store.toys) {
            els.toyList.innerHTML = "";

            if (!toys || toys.length === 0) {
                els.toyList.innerHTML = `<p class="text-center muted">Mahsulot topilmadi.</p>`;
                return;
            }

            const frag = document.createDocumentFragment();

            toys.forEach((b) => {
                const inCart = store.cart.some((c) => c.id === b.id);
                const shortDesc =
                    b.description && b.description.length > 90
                        ? b.description.slice(0, 90).trim() + "…"
                        : b.description || "";

                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <img src="${b.image}" alt="${b.title}" class="product-img" data-detail-id="${b.id}">
                    <h3 class="product-title" data-detail-id="${b.id}">${b.title}</h3>
                    <p class="product-brand">${b.brand || ""}</p>
                    <p class="product-desc muted">${shortDesc}</p>
                    <p class="product-price">${b.price.toLocaleString("uz-UZ")} so'm</p>
                    <div class="btn-group">
                        <button class="btn btn--primary add-to-cart-btn" data-id="${b.id}" ${inCart ? "disabled" : ""}>
                            ${inCart ? "Savatda" : "Savatga qo'shish"}
                        </button>
                        <button class="btn btn--secondary show-detail-btn" data-id="${b.id}">Ma'lumot</button>
                    </div>
                `;
                frag.appendChild(card);
            });

            els.toyList.appendChild(frag);
        },

        // =================================================================
        // 3.2 KATEGORIYALARNI CHIQARISH
        // =================================================================
        renderCategories() {
            const cats = [
                ...new Set(store.toys.map((b) => (b.category || "Boshqa").toString())),
            ];
            els.filterOptions.innerHTML = "";

            // "Barcha mahsulotlar" tugmasi
            const all = document.createElement("div");
            all.className = "filter-item active";
            all.dataset.filter = "all";
            all.textContent = "Barcha mahsulotlar";
            els.filterOptions.appendChild(all);

            // Kategoriya tugmalari
            cats.sort().forEach((c) => {
                const d = document.createElement("div");
                d.className = "filter-item";
                d.dataset.filter = c;
                d.textContent = c;
                els.filterOptions.appendChild(d);
            });
        },

        // =================================================================
        // 3.3 SAVATNI CHIQARISH
        // =================================================================
        renderCart() {
            if (!els.cartItemsList) return;

            if (!store.cart.length) {
                els.cartItemsList.innerHTML =
                    "<p class='muted' style='text-align:center'>Savat bo'sh</p>";
                els.orderAllBtn.style.display = "none";
                els.cartTotalPrice.textContent = "0 so'm";
                if (els.cartCount) els.cartCount.textContent = "0";
                return;
            }

            els.cartItemsList.innerHTML = store.cart
                .map(
                    (it) => `
                    <div class="cart-item" data-id="${it.id}">
                        <img src="${it.image}" alt="${it.title}" class="cart-item__img">
                        <div class="cart-item__details">
                            <p class="cart-item__title">${it.title}</p>
                            <p class="cart-item__price">${(it.price * it.quantity).toLocaleString("uz-UZ")} so'm</p>
                        </div>
                        <div class="cart-item__actions">
                            <div class="quantity-control">
                                <button class="quantity-decrease" data-id="${it.id}">-</button>
                                <span>${it.quantity}</span>
                                <button class="quantity-increase" data-id="${it.id}">+</button>
                            </div>
                            <button class="remove-from-cart-btn" data-id="${it.id}">×</button>
                        </div>
                    </div>
                `
                )
                .join("");

            const total = store.getTotal();
            els.cartTotalPrice.textContent = `${total.toLocaleString("uz-UZ")} so'm`;
            els.orderAllBtn.style.display = "block";

            if (els.cartCount) {
                els.cartCount.textContent = store.cart.reduce(
                    (s, i) => s + i.quantity,
                    0
                );
            }
        },

        // =================================================================
        // 3.4 MAHSULOT TAFSILOTLARINI CHIQARISH
        // =================================================================
        renderToyDetails(b) {
            els.detailImage.src = b.image || "";
            els.detailTitle.textContent = b.title || "";
            els.detailBrand.textContent = b.brand || "";
            els.detailCategory.textContent = b.category || "";
            els.detailPrice.textContent = b.price
                ? `${b.price.toLocaleString("uz-UZ")} so'm`
                : "";
            els.detailDescription.textContent = b.description || "";

            // Tafsilotlar ro'yxati
            const keys = ["id", "brand", "category", "price"];
            els.toyDetailsList.innerHTML = keys
                .filter((k) => b[k] !== undefined)
                .map(
                    (k) => `
                        <div class="toy-detail-item">
                            <span class="toy-detail-label">${k}:</span>
                            <span class="toy-detail-value">${b[k]}</span>
                        </div>
                    `
                )
                .join("");
        },

        // =================================================================
        // 3.5 MODALNI KO'RSATISH
        // =================================================================
        showModal(modal) {
            if (!modal) return;
            modal.classList.add("show");
            document.body.style.overflow = "hidden";
        },

        // =================================================================
        // 3.6 MODALNI YASHIRISH
        // =================================================================
        hideModal(modal) {
            if (!modal) return;
            modal.classList.remove("show");
            document.body.style.overflow = "";
        },

        // =================================================================
        // 3.7 XABAR KO'RSATISH - IKKALA JOYDA HAM
        // =================================================================
        showToast(msg, ok = true, position = "bottom") {
            let container;
            if (position === "top") {
                container = els.toastContainer;
            } else {
                container = els.toastContainerBottom;
            }
            
            if (!container) return;

            const t = document.createElement("div");
            t.className = `toast ${ok ? "success" : "error"}`;
            t.textContent = msg;
            container.appendChild(t);

            setTimeout(() => t.classList.add("show"), 10);

            setTimeout(() => {
                t.classList.remove("show");
                setTimeout(() => {
                    if (t.parentNode) {
                        t.parentNode.removeChild(t);
                    }
                }, 400);
            }, 3000);
        },

        // =================================================================
        // 3.8 AUTENTIFIKATSIYA INTERFEYSI
        // =================================================================
        updateAuthUI() {
            const u = store.getLoggedInUser();

            if (u) {
                // Foydalanuvchi kiritgan
                if (els.userActions) els.userActions.style.display = "none";
                if (els.userInfo) {
                    els.userInfo.style.display = "flex";
                    if (els.userDisplayEmail) {
                        els.userDisplayEmail.textContent = u.email || u.name || "";
                    }
                }
            } else {
                // Foydalanuvchi kirmagan
                if (els.userActions) els.userActions.style.display = "flex";
                if (els.userInfo) els.userInfo.style.display = "none";
            }
        },

        // =================================================================
        // 3.9 BANNER BOSHQARUVI - TO'G'RI ISHLAYDI
        // =================================================================
        toggleBanner(show) {
            if (!els.banner) return;

            if (show) {
                // Banner ko'rsatish
                els.banner.classList.remove("hidden");
                console.log("Banner ko'rsatildi");
            } else {
                // Banner yashirish
                els.banner.classList.add("hidden");
                console.log("Banner yashirildi");
            }
        },
    };

    // =================================================================
    // 4. TIL ALMASHTIRISH FUNKSIYALARI
    // =================================================================
    const translations = {
        uz: {
            // Header
            'searchPlaceholder': "O'yinchoqlar nomi va narxi...",
            'logout': "Chiqish",
            
            // Navigation
            'home': "Bosh sahifa",
            'catalog': "Katalog",
            'news': "Yangiliklar", 
            'bestsellers': "Xit savdo",
            'about': "Biz haqimizda",
            'contacts': "Kontaktlar",
            
            // Banner
            'bannerTitle': "Eng sara O'yinchoqlar siz uchun",
            'bannerDesc': "Siz hohlgan o'yinchoqlar",
            'bannerBtn': "Katalogni ko'rish",
            
            // Filter
            'all': "Barcha o'yinchoqlar",
            'constructor': "Konstruktorlar",
            'dolls': "Qo'g'irchoqlar",
            'soft': "Yumshoq o'yinchoqlar",
            'cars': "Mashinalar",
            'educational': "Ta'limiy",
            'puzzles': "Jumboqlar",
            'figures': "Figuralar",
            
            // Product buttons
            'addToCart': "Savatga qo'shish",
            'inCart': "Savatda",
            'details': "Ma'lumot",
            
            // Cart
            'cart': "Savat",
            'emptyCart': "Savat bo'sh",
            'total': "Jami",
            'order': "Buyurtma berish",
            
            // Modals
            'login': "Tizimga kirish",
            'register': "Ro'yxatdan o'tish",
            'orderTitle': "Buyurtmani rasmiylashtirish",
            'paymentMethod': "To'lov usulini tanlang:",
            'confirmOrder': "Buyurtmani tasdiqlash",
            
            // Footer
            'questions': "Savollaringiz bormi?",
            'categories': "Toifalar",
            'navigation': "Navigatsiya",
            'allToys': "Barcha o'yinchoqlar"
        },
        
        ru: {
            // Header
            'searchPlaceholder': "Название и цена игрушек...",
            'logout': "Выйти",
            
            // Navigation
            'home': "Главная",
            'catalog': "Каталог",
            'news': "Новости",
            'bestsellers': "Хит продаж", 
            'about': "О нас",
            'contacts': "Контакты",
            
            // Banner
            'bannerTitle': "Лучшие игрушки для вас",
            'bannerDesc': "Игрушки, которые вы хотите",
            'bannerBtn': "Смотреть каталог",
            
            // Filter
            'all': "Все игрушки",
            'constructor': "Конструкторы",
            'dolls': "Куклы",
            'soft': "Мягкие игрушки", 
            'cars': "Машины",
            'educational': "Обучающие",
            'puzzles': "Пазлы",
            'figures': "Фигурки",
            
            // Product buttons
            'addToCart': "В корзину",
            'inCart': "В корзине",
            'details': "Информация",
            
            // Cart
            'cart': "Корзина",
            'emptyCart': "Корзина пуста",
            'total': "Итого",
            'order': "Оформить заказ",
            
            // Modals
            'login': "Вход в систему",
            'register': "Регистрация",
            'orderTitle': "Оформление заказа",
            'paymentMethod': "Выберите способ оплаты:",
            'confirmOrder': "Подтвердить заказ",
            
            // Footer
            'questions': "Есть вопросы?",
            'categories': "Категории", 
            'navigation': "Навигация",
            'allToys': "Все игрушки"
        },
        
        en: {
            // Header
            'searchPlaceholder': "Toy name and price...",
            'logout': "Logout",
            
            // Navigation  
            'home': "Home",
            'catalog': "Catalog",
            'news': "News",
            'bestsellers': "Bestsellers",
            'about': "About",
            'contacts': "Contacts",
            
            // Banner
            'bannerTitle': "Best Toys For You", 
            'bannerDesc': "Toys You Want",
            'bannerBtn': "View Catalog",
            
            // Filter
            'all': "All toys",
            'constructor': "Constructors",
            'dolls': "Dolls",
            'soft': "Soft toys",
            'cars': "Cars", 
            'educational': "Educational",
            'puzzles': "Puzzles",
            'figures': "Figures",
            
            // Product buttons
            'addToCart': "Add to Cart",
            'inCart': "In Cart", 
            'details': "Details",
            
            // Cart
            'cart': "Cart",
            'emptyCart': "Cart is empty",
            'total': "Total",
            'order': "Place Order",
            
            // Modals
            'login': "Login",
            'register': "Register",
            'orderTitle': "Checkout",
            'paymentMethod': "Select payment method:",
            'confirmOrder': "Confirm Order",
            
            // Footer
            'questions': "Any questions?",
            'categories': "Categories",
            'navigation': "Navigation", 
            'allToys': "All toys"
        }
    };

    const languageManager = {
        currentLang: store.language,
        
        init() {
            this.setLanguage(this.currentLang);
            this.setupEventListeners();
        },
        
        setLanguage(lang) {
            this.currentLang = lang;
            store.language = lang;
            store.save();
            
            // Til tugmalarini yangilash
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.lang === lang) {
                    btn.classList.add('active');
                }
            });
            
            // Matnlarni yangilash
            this.updateTexts();
        },
        
        updateTexts() {
            const langData = translations[this.currentLang];
            
            // Qidiruv placeholder
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.placeholder = langData.searchPlaceholder;
            }
            
            // Navigation linklari
            document.querySelectorAll('.nav-link').forEach(link => {
                const currentText = link.textContent.trim();
                const translationKey = Object.keys(translations.uz).find(key => 
                    translations.uz[key] === currentText
                );
                if (translationKey && langData[translationKey]) {
                    link.textContent = langData[translationKey];
                }
            });
            
            // Filtr tugmalari
            document.querySelectorAll('.filter-item').forEach(item => {
                const currentText = item.textContent.trim();
                const translationKey = Object.keys(translations.uz).find(key => 
                    translations.uz[key] === currentText
                );
                if (translationKey && langData[translationKey]) {
                    item.textContent = langData[translationKey];
                }
            });
            
            // Banner matnlari
            const bannerTitle = document.querySelector('.banner-title');
            const bannerDesc = document.querySelector('.banner-description');
            const bannerBtn = document.querySelector('.banner-content .btn');
            
            if (bannerTitle) bannerTitle.textContent = langData.bannerTitle;
            if (bannerDesc) bannerDesc.textContent = langData.bannerDesc;
            if (bannerBtn) bannerBtn.textContent = langData.bannerBtn;
            
            // Footer matnlari
            document.querySelectorAll('footer h4').forEach(header => {
                const currentText = header.textContent.trim();
                const translationKey = Object.keys(translations.uz).find(key => 
                    translations.uz[key] === currentText
                );
                if (translationKey && langData[translationKey]) {
                    header.textContent = langData[translationKey];
                }
            });
            
            // Footer linklari
            document.querySelectorAll('.footer-links a').forEach(link => {
                const currentText = link.textContent.trim();
                const translationKey = Object.keys(translations.uz).find(key => 
                    translations.uz[key] === currentText
                );
                if (translationKey && langData[translationKey]) {
                    link.textContent = langData[translationKey];
                }
            });
            
            // Modal sarlavhalari
            const loginModal = document.querySelector('#login-modal h3');
            const registerModal = document.querySelector('#register-modal h3');
            const cartModal = document.querySelector('#cart-modal h3');
            const orderModal = document.querySelector('#order-modal h3');
            
            if (loginModal) loginModal.textContent = langData.login;
            if (registerModal) registerModal.textContent = langData.register;
            if (cartModal) cartModal.textContent = langData.cart;
            if (orderModal) orderModal.textContent = langData.orderTitle;
            
            // Modal tugmalari
            const loginBtn = document.querySelector('#login-form button');
            const registerBtn = document.querySelector('#register-form button');
            const orderBtn = document.querySelector('#order-form button');
            const logoutBtn = document.querySelector('#logout-btn');
            const orderAllBtn = document.querySelector('#order-all-btn');
            
            if (loginBtn) loginBtn.textContent = langData.login;
            if (registerBtn) registerBtn.textContent = langData.register;
            if (orderBtn) orderBtn.textContent = langData.confirmOrder;
            if (logoutBtn) logoutBtn.textContent = langData.logout;
            if (orderAllBtn) orderAllBtn.textContent = langData.order;
            
            // Payment method text
            const paymentTitle = document.querySelector('.payment-options h4');
            if (paymentTitle) paymentTitle.textContent = langData.paymentMethod;
        },
        
        setupEventListeners() {
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setLanguage(btn.dataset.lang);
                    ui.showToast(`Til ${btn.textContent} ga o'zgartirildi`, true, 'top');
                });
            });
        }
    };

    // =================================================================
    // 5. EVENT HANDLERLAR
    // =================================================================

    // =================================================================
    // 5.1 FILTR TUGMALARI HANDLERI
    // =================================================================
    function filterClickHandler(e) {
        const item = e.target.closest(".filter-item");
        if (!item) return;

        // Faqat bitta aktiv filtr
        document.querySelectorAll(".filter-item").forEach((it) => {
            it.classList.remove("active");
        });
        item.classList.add("active");

        ui.renderToys(store.getFiltered());
    }

    // =================================================================
    // 5.2 QIDIRUV HANDLERI - TO'G'RI ISHLAYDI
    // =================================================================
    function searchHandler() {
        const searchText = (els.searchInput.value || "").trim();
        
        console.log("Qidiruv matni:", searchText);
        
        // Mahsulotlarni filtrlash
        ui.renderToys(store.getFiltered());

        // Banner boshqaruvi
        if (searchText.length > 0) {
            // Qidiruv matni bor - banner yashirish
            ui.toggleBanner(false);
        } else {
            // Qidiruv matni yo'q - banner ko'rsatish
            ui.toggleBanner(true);
        }
    }

    // =================================================================
    // 5.3 MAHSULOTLAR RO'YXATI EVENTLARI
    // =================================================================
    els.toyList.addEventListener("click", (e) => {
        const addBtn = e.target.closest(".add-to-cart-btn");
        const detailBtn = e.target.closest(".show-detail-btn");
        const detailTarget = e.target.closest("[data-detail-id]");

        // Savatga qo'shish
        if (addBtn) {
            store.addToCart(addBtn.dataset.id);
            return;
        }

        // Ma'lumot tugmasi
        if (detailBtn) {
            const id = Number(detailBtn.dataset.id);
            const b = store.toys.find((x) => x.id === id);
            if (b) {
                ui.renderToyDetails(b);
                ui.showModal(els.detailModal);
            }
            return;
        }

        // Rasm yoki sarlavha bosilganda
        if (detailTarget) {
            const id = Number(detailTarget.dataset.detailId);
            const b = store.toys.find((x) => x.id === id);
            if (b) {
                ui.renderToyDetails(b);
                ui.showModal(els.detailModal);
            }
        }
    });

    // =================================================================
    // 5.4 SAVAT EVENTLARI
    // =================================================================
    if (els.cartItemsList) {
        els.cartItemsList.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (!id) return;

            if (e.target.classList.contains("remove-from-cart-btn")) {
                store.removeFromCart(id);
            } else if (e.target.classList.contains("quantity-increase")) {
                store.updateQuantity(id, 1);
            } else if (e.target.classList.contains("quantity-decrease")) {
                store.updateQuantity(id, -1);
            }
        });
    }

    // =================================================================
    // 5.5 MODAL OCHISH
    // =================================================================
    document.querySelectorAll("[data-modal-target]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            const target = document.querySelector(btn.dataset.modalTarget);
            if (!target) return;

            ui.showModal(target);

            // Savat modalini ochganda savatni yangilash
            if (btn.id === "cart-btn") {
                ui.renderCart();
            }
        });
    });

    // =================================================================
    // 5.6 MODAL YOPISH
    // =================================================================
    document.querySelectorAll(".close-modal").forEach((close) => {
        close.addEventListener("click", (ev) => {
            const modal = ev.target.closest(".modal-overlay");
            ui.hideModal(modal);
        });
    });

    // =================================================================
    // 5.7 MODAL OVERLAY BOSILGANDA YOPISH
    // =================================================================
    els.modals.forEach((m) => {
        m.addEventListener("click", (ev) => {
            if (ev.target === m) {
                ui.hideModal(m);
            }
        });
    });

    // =================================================================
    // 5.8 RO'YXATDAN O'TISH FORMASI
    // =================================================================
    if (els.registerForm) {
        els.registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const values = Array.from(e.target.elements).filter(
                (el) => el.name !== ""
            );
            const name = values[0]?.value || "";
            const email = values[1]?.value || "";
            const password = values[2]?.value || "";
            const confirm = values[3]?.value || "";

            // Parol tekshirish
            if (password !== confirm) {
                ui.showToast("Parollar mos emas", false, "top");
                if (els.registerMessage) {
                    els.registerMessage.textContent = "Parollar mos emas";
                }
                return;
            }

            // Email tekshirish
            if (store.users.find((u) => u.email === email)) {
                ui.showToast("Email mavjud", false, "top");
                if (els.registerMessage) {
                    els.registerMessage.textContent =
                        "Bu email allaqachon ro'yxatdan o'tgan";
                }
                return;
            }

            // Yangi foydalanuvchi
            const user = { name, email, password };
            store.users.push(user);
            store.setLoggedInUser(user);
            store.save();

            ui.updateAuthUI();
            ui.showToast("Ro'yxatdan o'tish muvaffaqiyatli", true, "top");
            ui.hideModal(els.registerModal);
        });
    }

    // =================================================================
    // 5.9 KIRISH FORMASI
    // =================================================================
    if (els.loginForm) {
        els.loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const [email, password] = Array.from(e.target.elements).map(
                (el) => el.value
            );
            const user = store.users.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                store.setLoggedInUser(user);
                ui.updateAuthUI();
                ui.showToast("Kirish muvaffaqiyatli", true, "top");
                ui.hideModal(els.loginModal);
            } else {
                ui.showToast("Noto'g'ri email yoki parol", false, "top");
                if (els.loginMessage) {
                    els.loginMessage.textContent = "Noto'g'ri email yoki parol!";
                }
            }
        });
    }

    // =================================================================
    // 5.10 BUYURTMA FORMASI - TO'LIQ ISHLAYDI
    // =================================================================
    if (els.orderForm) {
        els.orderForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!store.cart.length) {
                ui.showToast("Savat bo'sh", false, "top");
                if (els.orderMessage) {
                    els.orderMessage.textContent = "Savat bo'sh.";
                }
                return;
            }

            const formData = new FormData(e.target);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const address = formData.get('address');
            const email = formData.get('email');
            const note = formData.get('note');

            // To'lov usulini olish
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            const paymentMethods = {
                'payme': 'Payme',
                'uzumbank': 'Uzum Bank', 
                'naqd': 'Naqd pul'
            };
            const paymentMethodName = paymentMethods[paymentMethod];

            // Buyurtma ma'lumotlari
            const items = store.cart
                .map(
                    (it) =>
                        `• ${it.title} (${it.quantity} ta) - ${(it.price * it.quantity).toLocaleString("uz-UZ")} so'm`
                )
                .join("\n");

            const total = store.getTotal();

            // Xabar ko'rsatish
            ui.showToast(`Buyurtma qabul qilindi! To'lov usuli: ${paymentMethodName}`, true, "bottom");

            // Ma'lumotlarni consolega chiqarish (haqiqiy loyihada serverga yuboriladi)
            console.log('Buyurtma ma\'lumotlari:', {
                name,
                phone,
                address,
                email,
                note,
                paymentMethod: paymentMethodName,
                items: store.cart,
                total: total
            });

            // Savatni tozalash
            store.cart = [];
            store.save();
            ui.renderCart();

            // Formani tozalash
            e.target.reset();
            ui.hideModal(els.orderModal);
        });
    }

    // =================================================================
    // 5.11 SAVATDAGI BARCHA MAHSULOTLARNI BUYURTMA QILISH
    // =================================================================
    if (els.orderAllBtn) {
        els.orderAllBtn.addEventListener("click", () => {
            const user = store.getLoggedInUser();

            // Autentifikatsiya tekshirish
            if (!user) {
                ui.showToast("Buyurtma berish uchun kirish kerak", false, "top");
                ui.showModal(els.loginModal);
                return;
            }

            if (!store.cart.length) return;

            // Buyurtma ma'lumotlari
            const summary = store.cart
                .map(
                    (it) =>
                        `• ${it.title} (${it.quantity}) - ${(it.price * it.quantity).toLocaleString("uz-UZ")} so'm`
                )
                .join("\n");

            if (els.orderToyInfo) {
                els.orderToyInfo.textContent = `Savatdagi barcha mahsulotlar:\n${summary}`;
            }

            ui.hideModal(els.cartModal);
            ui.showModal(els.orderModal);
        });
    }

    // =================================================================
    // 5.12 TEMA O'ZGARTIRISH
    // =================================================================
    if (els.themeToggle) {
        els.themeToggle.addEventListener("click", () => {
            const isLight = document.body.classList.toggle("light-mode");
            store.theme = isLight ? "light" : "dark";
            store.save();

            ui.showToast(
                `Mavzu ${isLight ? "yorugʻ" : "qorongʻi"} rejimga o'zgartirildi!`,
                true,
                "top"
            );
        });
    }

    // =================================================================
    // 5.13 CHIQISH TUGMASI
    // =================================================================
    if (els.logoutBtn) {
        els.logoutBtn.addEventListener("click", () => {
            store.logout();
            ui.updateAuthUI();
            ui.showToast("Chiqish muvaffaqiyatli", true, "top");
        });
    }

    // =================================================================
    // 5.14 SCROLL EVENTLARI
    // =================================================================
    if (els.scrollToTop) {
        els.scrollToTop.forEach((link) => {
            link.addEventListener("click", (ev) => {
                ev.preventDefault();
                ui.toggleBanner(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });
    }

    // =================================================================
    // 5.15 KATALOGGA SCROLL QILISH
    // =================================================================
    if (els.scrollToProducts) {
        els.scrollToProducts.forEach((link) => {
            link.addEventListener("click", (ev) => {
                ev.preventDefault();
                const catalogAnchor = document.getElementById("catalog-anchor");
                if (catalogAnchor) {
                    catalogAnchor.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    // =================================================================
    // 5.16 TELEFON RAQAMI FORMATA
    // =================================================================
    if (els.orderForm) {
        const phoneInput = els.orderForm.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (!value.startsWith("998")) {
                    value = "998" + value;
                }
                if (value.length > 12) {
                    value = value.slice(0, 12);
                }
                e.target.value = "+" + value;
            });
        }
    }

    // =================================================================
    // 5.17 FILTER LINKLARI UCHUN HANDLER
    // =================================================================
    document.addEventListener("click", (e) => {
        // Footer toifalari uchun
        if (e.target.classList.contains("filter-link")) {
            e.preventDefault();
            const filter = e.target.dataset.filter;
            
            // Filtrni o'rnatish
            document.querySelectorAll(".filter-item").forEach((item) => {
                item.classList.remove("active");
                if (item.dataset.filter === filter) {
                    item.classList.add("active");
                }
            });

            // Mahsulotlarni filtrlash
            ui.renderToys(store.getFiltered());
            
            // Katalogga scroll qilish
            const catalogAnchor = document.getElementById("catalog-anchor");
            if (catalogAnchor) {
                catalogAnchor.scrollIntoView({ behavior: "smooth" });
            }
            
            ui.showToast(`${e.target.textContent} toifasi tanlandi`, true, "top");
        }
    });

    // =================================================================
    // 5.18 NAVIGATSIYA LINKLARI UCHUN HANDLER
    // =================================================================
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("scroll-to-top") || 
            e.target.classList.contains("scroll-to-products")) {
            e.preventDefault();
            
            if (e.target.classList.contains("scroll-to-top")) {
                // Bosh sahifaga
                ui.toggleBanner(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                // Katalogga
                const catalogAnchor = document.getElementById("catalog-anchor");
                if (catalogAnchor) {
                    catalogAnchor.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    });

    // =================================================================
    // 6. EVENT LISTENERLARNI ULASH
    // =================================================================
    els.filterOptions.addEventListener("click", filterClickHandler);
    els.searchInput.addEventListener("input", searchHandler);

    // =================================================================
    // 7. DASTURNI ISHGA TUSHIRISH
    // =================================================================
    (async function startup() {
        // Ma'lumotlarni yuklash
        await store.load();

        // Interfeysni yangilash
        ui.renderCategories();
        ui.renderToys(store.toys);
        ui.renderCart();
        ui.updateAuthUI();

        // Til almashtirishni ishga tushirish
        languageManager.init();

        // Banner ko'rsatish (dastlab)
        ui.toggleBanner(true);

        // Mavzuni sozlash
        if (store.theme === "light") {
            document.body.classList.add("light-mode");
        }

        // Test xabari
        setTimeout(() => {
            ui.showToast("TOy STore-ga xush kelibsiz!", true, "bottom");
        }, 1000);

        console.log("TOy STore tayyor! Barcha funksiyalar ishga tushirildi.");
    })();
});