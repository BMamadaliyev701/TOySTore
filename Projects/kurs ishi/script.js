// =================================================================
// 0. DOM YUKLANGANDA ISHGA TUSHADI
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // 1. ELEMENTLAR (DOM REFENSIYALARI)
    // =================================================================
    const els = {
        bookList: document.getElementById("book-list"),
        filterOptions: document.getElementById("filterOptions"),
        searchInput: document.getElementById("searchInput"),
        banner: document.getElementById("banner"), // Banner elementiga murojaat

        themeToggle: document.getElementById("theme-toggle"),
        toastContainer: document.getElementById('toast-container'),
        loaderOverlay: document.getElementById('loader'),
        
        modals: document.querySelectorAll(".modal-overlay"),
        loginModal: document.getElementById("login-modal"),
        registerModal: document.getElementById("register-modal"),
        orderModal: document.getElementById("order-modal"),
        detailModal: document.getElementById("book-detail-modal"),

        detailImage: document.getElementById("detail-image"),
        detailTitle: document.getElementById("detail-title"),
        detailAuthor: document.getElementById("detail-author"),
        detailCategory: document.getElementById("detail-category"),
        detailPrice: document.getElementById("detail-price"),
        detailDescription: document.getElementById("detail-description"),
        bookDetailsList: document.getElementById("book-details-list"),

        cartIcon: document.querySelector('.cart-icon'),
        cartModal: document.getElementById('cart-modal'),
        cartItemsContainer: document.getElementById('cart-items'),
        cartTotalElement: document.getElementById('cart-total'),
        checkoutBtn: document.getElementById('checkout-btn'),
        cartCountElement: document.getElementById('cart-count'),

        orderForm: document.getElementById('order-form'),
        orderMessage: document.getElementById('order-message'),

        searchResult: document.getElementById('search-result'),
        
        scrollToTop: document.querySelector('.scroll-to-top'),
    };
    
    // =================================================================
    // 2. YORDAMCHI FUNKSIYALAR (HELPERS)
    // =================================================================
    function createBookCard(book) {
        const isInCart = store.cart.some(item => item.id === book.id);
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-card__img-container">
                <img src="${book.image}" alt="${book.title}" class="product-card__img" />
            </div>
            <h3 class="product-title" title="${book.title}">${book.title}</h3>
            <p class="product-author">${book.author}</p>
            <p class="product-price">${book.price.toLocaleString("uz-UZ")} so'm</p>
            <div class="btn-group">
                <button class="btn btn--secondary detail-btn" data-id="${book.id}">
                    <i class="fa-solid fa-eye"></i> Batafsil
                </button>
                <button class="btn btn--primary add-to-cart-btn" data-id="${book.id}" ${isInCart ? 'disabled' : ''}>
                    <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'Savatda' : 'Savatga qo\'shish'}
                </button>
            </div>
        `;
        return card;
    }

    function createCartItem(item) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" alt="${item.title}" class="cart-item-img"></td>
            <td>${item.title}</td>
            <td class="cart-item-price">${item.price.toLocaleString("uz-UZ")} so'm</td>
            <td>
                <button class="btn btn--sm btn--secondary quantity-minus" data-id="${item.id}">-</button>
                <span class="quantity-text">${item.quantity}</span>
                <button class="btn btn--sm btn--secondary quantity-plus" data-id="${item.id}">+</button>
            </td>
            <td class="cart-item-subtotal">${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm</td>
            <td><button class="btn btn--sm btn--danger remove-from-cart" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button></td>
        `;
        return tr;
    }

    // =================================================================
    // 3. XOTIRA / HOLAT (STATE)
    // =================================================================
    const store = {
        books: [],
        cart: JSON.parse(localStorage.getItem('bookCart')) || [],
        theme: localStorage.getItem('theme') || 'dark',

        async fetchBooks() {
            try {
                ui.showLoader();
                const response = await fetch("./data.json");
                if (!response.ok) throw new Error("Kitoblar yuklanmadi");
                this.books = await response.json();
                ui.renderBookList(this.books);
                ui.renderCategories(this.books);
            } catch (error) {
                console.error(error);
                ui.showToast(`Xatolik: ${error.message}`, false);
            } finally {
                ui.hideLoader();
            }
        },

        save() {
            localStorage.setItem('bookCart', JSON.stringify(this.cart));
            localStorage.setItem('theme', this.theme);
        },

        // Savat funksiyalari
        addToCart(bookId) {
            const book = this.books.find(b => b.id == bookId);
            if (!book) return;

            const existingItem = this.cart.find(item => item.id === book.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({ ...book, quantity: 1 });
            }
            this.save();
            ui.renderCart();
            ui.renderBookList(this.books); // Button holatini yangilash
            ui.showToast(`${book.title} savatga qo'shildi!`, true);
        },

        updateQuantity(bookId, delta) {
            const item = this.cart.find(i => i.id == bookId);
            if (item) {
                item.quantity += delta;
                if (item.quantity <= 0) {
                    this.removeFromCart(bookId);
                } else {
                    this.save();
                    ui.renderCart();
                }
            }
        },

        removeFromCart(bookId) {
            const bookToRemove = this.cart.find(i => i.id == bookId);
            this.cart = this.cart.filter(item => item.id != bookId);
            this.save();
            ui.renderCart();
            ui.renderBookList(this.books); // Button holatini yangilash
            if (bookToRemove) {
                ui.showToast(`${bookToRemove.title} savatdan o'chirildi.`, true);
            }
        },

        getTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.save();
            ui.applyTheme();
        }
    };
    
    // =================================================================
    // 4. INTERFEYS FUNKSIYALARI (UI)
    // =================================================================
    const ui = {
        renderBookList(books) {
            els.bookList.innerHTML = '';
            if (books.length === 0) {
                els.bookList.innerHTML = '<p class="text-center muted">Afsuski, bu mezonlarga mos keladigan kitoblar topilmadi.</p>';
            } else {
                books.forEach(book => els.bookList.appendChild(createBookCard(book)));
            }
            // Qidiruv natijalarini tozalash (agar kitoblar asosiy ro'yxat bo'lsa)
            if (els.searchInput.value.trim() === '') {
                 els.searchResult.innerHTML = '';
            }
        },

        renderCategories(books) {
            const categories = [...new Set(books.map(book => book.category.toLowerCase()))];
            els.filterOptions.innerHTML = `<option value="">Barcha kategoriyalar</option>`;
            categories.sort().forEach(cat => {
                const capitalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
                els.filterOptions.innerHTML += `<option value="${cat}">${capitalizedCat}</option>`;
            });
        },

        renderCart() {
            els.cartItemsContainer.innerHTML = '';
            if (store.cart.length === 0) {
                els.cartItemsContainer.innerHTML = '<tr><td colspan="6" class="text-center muted">Savat bo\'sh.</td></tr>';
                els.checkoutBtn.disabled = true;
                els.checkoutBtn.textContent = 'Savat bo\'sh';
            } else {
                store.cart.forEach(item => els.cartItemsContainer.appendChild(createCartItem(item)));
                els.checkoutBtn.disabled = false;
                els.checkoutBtn.textContent = 'Buyurtma berish';
            }
            els.cartTotalElement.textContent = store.getTotal().toLocaleString("uz-UZ") + " so'm";
            els.cartCountElement.textContent = store.cart.length;
        },

        renderBookDetails(book) {
            const details = [
                { label: "ISBN", value: book.isbn || "Ma'lumot yo'q" },
                { label: "Yozuv", value: book.script || "Ma'lumot yo'q" },
                { label: "Yil", value: book.year || "Ma'lumot yo'q" },
                { label: "Til", value: book.language || "Ma'lumot yo'q" },
                { label: "Sahifalar", value: book.pages || "Ma'lumot yo'q" },
                { label: "Nashriyot", value: book.publisher || "Ma'lumot yo'q" },
                { label: "Muqova", value: book.cover || "Ma'lumot yo'q" },
            ];
            
            els.bookDetailsList.innerHTML = details.map(d => `<p><strong class="muted">${d.label}:</strong> ${d.value}</p>`).join('');
        },

        showModal(modal) {
            modal.classList.add("modal-open");
            document.body.classList.add('no-scroll');
        },

        hideModal(modal) {
            modal.classList.remove("modal-open");
            document.body.classList.remove('no-scroll');
        },

        showToast(message, isSuccess) {
            const toast = document.createElement('div');
            toast.className = `toast ${isSuccess ? 'toast--success' : 'toast--error'}`;
            toast.textContent = message;
            els.toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('toast-show');
            }, 10); // Animatsiya uchun kechikish
            setTimeout(() => {
                toast.classList.remove('toast-show');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 4000);
        },

        showLoader() {
            els.loaderOverlay.style.display = 'flex';
        },

        hideLoader() {
            els.loaderOverlay.style.display = 'none';
        },

        showLocalMsg(element, message, isSuccess) {
            element.textContent = message;
            element.className = isSuccess ? 'success-message' : 'error-message';
            element.style.display = 'block';
        },

        updateSearchResult(isFound, searchTerm) {
            if (searchTerm.trim() === '') {
                 els.searchResult.innerHTML = '';
            } else if (isFound) {
                els.searchResult.innerHTML = `<i class="fa-solid fa-check-circle success-message"></i> Qidiruv natijasi: <strong>"${searchTerm}"</strong> bo'yicha topildi.`;
            } else {
                els.searchResult.innerHTML = `<i class="fa-solid fa-circle-xmark error-message"></i> Qidiruv natijasi: <strong>"${searchTerm}"</strong> bo'yicha topilmadi.`;
            }
        },

        applyTheme() {
            document.body.className = store.theme === 'light' ? 'light-mode' : '';
        },
    };
    
    // =================================================================
    // 5. INIT (ILOVANI BOSHLASH)
    // =================================================================
    const init = () => {
        store.fetchBooks();
        ui.renderCart();
        ui.applyTheme();
    };

    // =================================================================
    // 6. XODISALARNI QAYTA ISHLOVCHILAR (HANDLERS)
    // =================================================================
    const handlers = {
        
        // Asosiy kitoblar ro'yxatini filtrlash
        filterBooks() {
            const selectedCategory = els.filterOptions.value.toLowerCase();
            const searchTerm = els.searchInput.value.toLowerCase().trim();

            const filtered = store.books.filter(book => {
                const categoryMatch = !selectedCategory || book.category.toLowerCase() === selectedCategory;
                const searchMatch = !searchTerm || 
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.category.toLowerCase().includes(searchTerm);
                return categoryMatch && searchMatch;
            });

            // Qidiruv natijasi faqatgina qidiruv maydoni to'ldirilgan bo'lsa yangilanadi
            if (searchTerm) {
                ui.updateSearchResult(filtered.length > 0, searchTerm);
            }
            
            ui.renderBookList(filtered);

            // Qidiruv/Filtr tugagach, banner holatini tekshirish
            if (searchTerm.length > 0 || selectedCategory.length > 0) {
                 // Agar qidiruv yoki filtr aktiv bo'lsa -> Bannerni yashirish
                 els.banner.style.display = 'none';
                 els.banner.style.height = '0';
            } else {
                // Agar qidiruv va filtr bo'sh bo'lsa -> Bannerni qayta ko'rsatish
                els.banner.style.display = 'flex'; // yoki 'block'
                els.banner.style.height = 'auto'; 
            }
        },

        // Qidiruv faqat
        searchBooks() {
            const searchTerm = els.searchInput.value.toLowerCase().trim();
            const selectedCategory = els.filterOptions.value.toLowerCase(); // Filtr bilan ham ishlashi uchun

            const filteredBooks = store.books.filter(book => 
                (book.title.toLowerCase().includes(searchTerm) ||
                 book.author.toLowerCase().includes(searchTerm) ||
                 book.category.toLowerCase().includes(searchTerm)) &&
                (!selectedCategory || book.category.toLowerCase() === selectedCategory)
            );
            
            // >>> KERAKLI O'ZGARTIRISH: Banner logikasi
            if (searchTerm.length > 0) {
                // Agar qidiruv maydoni bo'sh bo'lmasa -> Bannerni yashirish
                els.banner.style.display = 'none';
                els.banner.style.height = '0';
            } else {
                // Agar qidiruv maydoni bo'sh bo'lsa (va filtr ham bo'sh bo'lsa) -> Bannerni qayta ko'rsatish
                // Faqatgina kategoriya filtrlanmagan bo'lsa ko'rsatish maqsadga muvofiq
                if (!selectedCategory) {
                    els.banner.style.display = 'flex'; 
                    els.banner.style.height = 'auto';
                }
            }
            // <<< O'ZGARTIRISH TUGADI
            
            ui.renderBookList(filteredBooks);
            ui.updateSearchResult(filteredBooks.length > 0, searchTerm);
        },

        handleCartAction(e) {
            const target = e.target.closest('.add-to-cart-btn, .remove-from-cart, .quantity-plus, .quantity-minus');
            if (!target) return;
            const bookId = target.dataset.id;

            if (target.classList.contains('add-to-cart-btn')) {
                store.addToCart(bookId);
            } else if (target.classList.contains('remove-from-cart')) {
                store.removeFromCart(bookId);
            } else if (target.classList.contains('quantity-plus')) {
                store.updateQuantity(bookId, 1);
            } else if (target.classList.contains('quantity-minus')) {
                store.updateQuantity(bookId, -1);
            }
        },

        handleDetailAction(e) {
            const target = e.target.closest('.detail-btn');
            if (!target) return;
            const bookId = target.dataset.id;
            const book = store.books.find(b => b.id == bookId);
            if (book) {
                handlers.showBookDetail(book);
            }
        },

        showBookDetail(book) {
            els.detailImage.src = book.image;
            els.detailTitle.textContent = book.title;
            els.detailAuthor.textContent = book.author;
            els.detailCategory.textContent = book.category.charAt(0).toUpperCase() + book.category.slice(1);
            els.detailPrice.textContent = `${book.price.toLocaleString("uz-UZ")} so'm`;
            els.detailDescription.textContent = book.description || "Tavsif mavjud emas.";
            
            // Kitob tafsilotlarini ko'rsatish
            ui.renderBookDetails(book);
            
            ui.showModal(els.detailModal);
        },

        handleOrderSubmit(e) {
            e.preventDefault();
            
            if (store.cart.length === 0) {
                ui.showLocalMsg(els.orderMessage, "Savat bo'sh. Iltimos, avval kitob qo'shing.", false);
                return;
            }

            // Real serverga yuborish o'rniga namuna kodi (Sizning asl kodingizdan olindi)
            const orderData = {
                cart: store.cart,
                name: e.target.elements.name.value,
                phone: e.target.elements.phone.value,
                passport: e.target.elements.passport.value,
                note: e.target.elements.note.value,
                total: store.getTotal(),
            };

            // Serverga yuborishni simulyatsiya qilish
            // fetch() API real loyihada kerak bo'ladi. Hozirda faqat xabar ko'rsatiladi.
            new Promise(resolve => setTimeout(() => resolve({ ok: true }), 1000))
            .then(data => {
                if (data.ok) {
                    ui.showLocalMsg(els.orderMessage, "Buyurtmangiz qabul qilindi!", true);
                    store.cart = []; store.save(); ui.renderCart(); e.target.reset();
                    ui.showToast("Buyurtmangiz muvaffaqiyatli yuborildi! Kuryer siz bilan bog'lanadi.", true);
                    setTimeout(() => { ui.hideModal(els.orderModal); els.orderMessage.textContent = ''; }, 3000);
                } else {
                    ui.showLocalMsg(els.orderMessage, "Xatolik yuz berdi.", false);
                }
            }).catch(() => ui.showLocalMsg(els.orderMessage, "Tarmoq xatosi.", false));
        },

        // Scroll to top
        handleScroll() {
            if (window.scrollY > 300) {
                els.scrollToTop.classList.add('show');
            } else {
                els.scrollToTop.classList.remove('show');
            }
        },

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // =================================================================
    // 7. XODISALARNI BIRIKTIRISH (LISTENERS)
    // =================================================================
    els.filterOptions.addEventListener('change', handlers.filterBooks);
    els.searchInput.addEventListener('input', handlers.searchBooks);
    els.bookList.addEventListener('click', handlers.handleCartAction);
    els.bookList.addEventListener('click', handlers.handleDetailAction);
    els.cartItemsContainer.addEventListener('click', handlers.handleCartAction);

    // Modal funksionalligi
    els.cartIcon.addEventListener('click', () => ui.showModal(els.cartModal));
    els.checkoutBtn.addEventListener('click', () => { ui.hideModal(els.cartModal); ui.showModal(els.orderModal); });
    els.orderForm.addEventListener('submit', handlers.handleOrderSubmit);
    
    // Barcha modal yopish tugmalarini biriktirish
    els.modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-modal') || e.target.closest('.close-modal')) {
                ui.hideModal(modal);
            }
        });
    });

    // Theme toggle
    els.themeToggle.addEventListener('click', () => {
        store.toggleTheme();
    });

    // Scroll to top listener
    window.addEventListener('scroll', handlers.handleScroll);
    if (els.scrollToTop) {
        els.scrollToTop.addEventListener('click', handlers.scrollToTop);
    }
    
    // =================================================================
    // 8. BOSHLASH
    // =================================================================
    init();
});// =================================================================
// 0. DOM YUKLANGANDA ISHGA TUSHADI
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // 1. ELEMENTLAR (DOM REFENSIYALARI)
    // =================================================================
    const els = {
        bookList: document.getElementById("book-list"),
        filterOptions: document.getElementById("filterOptions"),
        searchInput: document.getElementById("searchInput"),
        banner: document.getElementById("banner"),

        themeToggle: document.getElementById("theme-toggle"),
        toastContainer: document.getElementById('toast-container'),
        loaderOverlay: document.getElementById('loader'),
        
        modals: document.querySelectorAll(".modal-overlay"),
        loginModal: document.getElementById("login-modal"),
        registerModal: document.getElementById("register-modal"),
        orderModal: document.getElementById("order-modal"),
        detailModal: document.getElementById("book-detail-modal"),

        detailImage: document.getElementById("detail-image"),
        detailTitle: document.getElementById("detail-title"),
        detailAuthor: document.getElementById("detail-author"),
        detailCategory: document.getElementById("detail-category"),
        detailPrice: document.getElementById("detail-price"),
        detailDescription: document.getElementById("detail-description"),
        bookDetailsList: document.getElementById("book-details-list"),

        loginForm: document.getElementById("login-form"),
        registerForm: document.getElementById("register-form"),
        orderForm: document.getElementById("order-form"),
        
        userActions: document.querySelector('.user-actions'),
        userInfo: document.querySelector('.user-info'),
        userDisplayEmail: document.getElementById('user-display-email'),
        logoutBtn: document.getElementById('logout-btn'),
        
        cartCount: document.getElementById('cart-count'),
        cartItemsList: document.getElementById('cart-items-list'),
        cartTotalPrice: document.getElementById('cart-total-price'),
        orderAllBtn: document.getElementById('order-all-btn'),
        
        loginMessage: document.getElementById("login-message"),
        registerMessage: document.getElementById("register-message"),
        orderMessage: document.getElementById("order-message"),
    };
    
    // =================================================================
    // 2. MA'LUMOTLARNI BOSHQARISH
    // =================================================================
    const store = {
        books: [], users: [], cart: [],
        
        async load() {
            try {
                this.users = JSON.parse(localStorage.getItem("users")) || [];
                this.cart = JSON.parse(localStorage.getItem("cart")) || [];
                
                const response = await fetch("./data.json");
                if (!response.ok) throw new Error("data.json yuklanmadi");
                const freshBooks = await response.json();
                if (Array.isArray(freshBooks) && freshBooks.length > 0) {
                    this.books = freshBooks;
                    this.save();
                } else {
                    this.books = JSON.parse(localStorage.getItem("books")) || [];
                }
            } catch (e) {
                console.error(e);
                this.books = JSON.parse(localStorage.getItem("books")) || [];
            }
        },
        
        save() {
            localStorage.setItem("books", JSON.stringify(this.books));
            localStorage.setItem("users", JSON.stringify(this.users));
            localStorage.setItem("cart", JSON.stringify(this.cart));
        },
        
        getLoggedInUser: () => JSON.parse(localStorage.getItem("loggedInUser")),
        setLoggedInUser: user => localStorage.setItem("loggedInUser", JSON.stringify(user)),
        logout: () => localStorage.removeItem("loggedInUser")
    };
    
    // =================================================================
    // 3. INTERFEYS FUNKSIYALARI
    // =================================================================
    const ui = {
        showModal: modal => {
            modal.classList.add("show");
            document.body.style.overflow = 'hidden';
        },
        hideModal: modal => {
            modal.classList.remove("show");
            document.body.style.overflow = '';
        },
        hideLoader() {
            els.loaderOverlay.style.opacity = '0';
            setTimeout(() => els.loaderOverlay.style.display = 'none', 500);
        },
        
        showLocalMsg(el, text, isSuccess) {
            el.textContent = text;
            el.style.color = isSuccess ? "green" : "red";
        },
        
        showToast(message, isSuccess = true) {
            const toast = document.createElement('div');
            toast.classList.add('toast', isSuccess ? 'success' : 'error');
            toast.textContent = message;
            els.toastContainer.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        },
        
        renderBooks(booksToRender) {
            if (booksToRender.length === 0) {
                els.bookList.innerHTML = `
                    <div class="empty-state-message">
                        <h3>Kitoblar topilmadi</h3>
                        <p>Qidiruv so'rovingizga mos keladigan hech qanday kitob yo'q.</p>
                    </div>
                `;
                return;
            }
            
            els.bookList.innerHTML = booksToRender.map(book => `
                <div class="product-card" data-id="${book.id}">
                    <img src="${book.image}" alt="${book.title}" class="product-img">
                    <h3 class="product-title">${book.title}</h3>
                    <p class="product-author">${book.author}</p> 
                    <p class="product-price">${book.price.toLocaleString("uz-UZ")} so'm</p>
                    
                    <div class="btn-group">
                        <button class="btn btn--primary add-to-cart-btn" data-id="${book.id}">Savatga</button>
                        <button class="btn btn--secondary show-detail-btn" data-id="${book.id}">Ma'lumot</button>
                    </div>
                </div>
            `).join("");
        },
        
        renderCart() {
            const totalItems = store.cart.reduce((sum, item) => sum + item.quantity, 0);
            if (store.cart.length === 0) {
                els.cartItemsList.innerHTML = "<p class='muted' style='text-align: center;'>Savat bo'sh</p>";
                els.orderAllBtn.style.display = 'none';
                els.cartTotalPrice.textContent = "0 so'm";
            } else {
                els.cartItemsList.innerHTML = store.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="cart-item__img">
                        <div class="cart-item__details">
                            <p class="cart-item__title">${item.title}</p>
                            <p class="cart-item__price">${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm</p>
                        </div>
                        <div class="cart-item__actions">
                            <div class="quantity-control">
                                <button class="quantity-decrease" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-from-cart-btn" data-id="${item.id}">×</button>
                        </div>
                    </div>
                `).join("");
                const total = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                els.cartTotalPrice.textContent = `${total.toLocaleString("uz-UZ")} so'm`;
                els.orderAllBtn.style.display = 'block';
            }
            els.cartCount.textContent = totalItems;
        },
        
        updateAuthUI() {
            const user = store.getLoggedInUser();
            if (user) {
                els.userActions.style.display = 'none';
                els.userInfo.style.display = 'flex';
                els.userDisplayEmail.textContent = user.email;
            } else {
                els.userActions.style.display = 'flex';
                els.userInfo.style.display = 'none';
            }
        },
        
        setTheme(isLight) {
            document.body.classList.toggle('light-mode', isLight);
        },
        
        toggleBanner(show) {
            if (show) {
                els.banner.classList.remove('hidden');
                setTimeout(() => {
                    els.banner.style.display = 'block';
                }, 50);
            } else {
                els.banner.classList.add('hidden');
                setTimeout(() => {
                    if (els.banner.classList.contains('hidden')) {
                        els.banner.style.display = 'none';
                    }
                }, 300);
            }
        },
        
        renderBookDetails(book) {
            let detailsHTML = '';
            
            if (book.isbn) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">ISBN:</span>
                    <span class="book-detail-value">${book.isbn}</span>
                </div>`;
            }
            
            if (book.script) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">Yozuvi:</span>
                    <span class="book-detail-value">${book.script}</span>
                </div>`;
            }
            
            if (book.year) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">Yili:</span>
                    <span class="book-detail-value">${book.year}</span>
                </div>`;
            }
            
            if (book.language) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">Tili:</span>
                    <span class="book-detail-value">${book.language}</span>
                </div>`;
            }
            
            if (book.pages) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">Betlar soni:</span>
                    <span class="book-detail-value">${book.pages}</span>
                </div>`;
            }
            
            if (book.publisher) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">Nashriyot:</span>
                    <span class="book-detail-value">${book.publisher}</span>
                </div>`;
            }
            
            if (book.cover) {
                detailsHTML += `<div class="book-detail-item">
                    <span class="book-detail-label">Muqova:</span>
                    <span class="book-detail-value">${book.cover}</span>
                </div>`;
            }
            
            els.bookDetailsList.innerHTML = detailsHTML;
        }
    };
    
    // =================================================================
    // 4. ILOVA BOSHQARUVCHI
    // =================================================================
    const app = {
        async init() {
            await store.load();
            this.handleEvents();
            this.filterAndRender();
            ui.updateAuthUI();
            ui.renderCart();
            ui.hideLoader();
            this.checkInitialTheme();
        },
        
        handleEvents() {
            // Modal ochish/yopish
            document.querySelectorAll('[data-modal-target]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modal = document.querySelector(e.currentTarget.dataset.modalTarget);
                    if (modal) ui.showModal(modal);
                    if (e.currentTarget.id === 'cart-btn') ui.renderCart();
                });
            });
            document.querySelectorAll('.close-modal').forEach(btn => 
                btn.addEventListener('click', (e) => ui.hideModal(e.target.closest('.modal-overlay'))));
            els.modals.forEach(modal => 
                modal.addEventListener('click', (e) => {
                    if (e.target.classList.contains('modal-overlay')) ui.hideModal(modal);
                }));
                
            // Asosiy funksiyalar
            els.filterOptions.addEventListener("click", this.filterAndRender.bind(this));
            els.searchInput.addEventListener("input", this.filterAndRender.bind(this));
            els.bookList.addEventListener("click", this.handleBookActions.bind(this));
            els.themeToggle.addEventListener("click", this.handleThemeToggle.bind(this));
            els.logoutBtn.addEventListener("click", this.handleLogout.bind(this));
            els.cartItemsList.addEventListener("click", this.handleCartActions.bind(this));
            els.orderAllBtn.addEventListener("click", this.handleOrderAll.bind(this));
            
            // Formlar
            els.registerForm.addEventListener("submit", this.handleRegister.bind(this));
            els.loginForm.addEventListener("submit", this.handleLogin.bind(this));
            els.orderForm.addEventListener("submit", this.handleOrder.bind(this));

            // =================================================================
            // YANGI: SILLIQ SCROLL – LOGO, BOSH SAHIFA, KATALOG
            // =================================================================
            // Tepaga scroll
            document.querySelectorAll('.scroll-to-top').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    ui.toggleBanner(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });

            // Katalog → filtr ostidagi kitoblarga
            document.querySelectorAll('.scroll-to-products').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const anchor = document.getElementById('catalog-anchor');
                    if (anchor) {
                        // Filtr elementlarini ko'rsatish uchun qo'shimcha scroll
                        const filterContainer = document.querySelector('.filter-container');
                        const filterRect = filterContainer.getBoundingClientRect();
                        const offset = 100; // Xavfsiz masofa
                        
                        window.scrollTo({
                            top: window.scrollY + filterRect.top - offset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // =================================================================
            // YANGI: BANNER BOSHQARUVI - QIDIRUV BILAN
            // =================================================================
            // Qidiruv maydoniga fokus bo'lganda banner yashirinadi
            els.searchInput.addEventListener('focus', () => {
                ui.toggleBanner(false);
            });
            
            // Qidiruv maydonidan chiqilganda va qidiruv bo'sh bo'lsa banner qaytadan paydo bo'ladi
            els.searchInput.addEventListener('blur', () => {
                if (els.searchInput.value.trim() === '') {
                    ui.toggleBanner(true);
                }
            });
            
            // Qidiruv maydoni bo'shatilganda banner qaytadan paydo bo'ladi
            els.searchInput.addEventListener('input', () => {
                if (els.searchInput.value.trim() === '') {
                    ui.toggleBanner(true);
                } else {
                    ui.toggleBanner(false);
                }
            });
        },
        
        filterAndRender(e) {
            if (e && e.target.classList.contains('filter-item')) {
                els.filterOptions.querySelector('.active')?.classList.remove('active');
                e.target.classList.add('active');
            }
            const activeFilter = els.filterOptions.querySelector('.active')?.dataset.filter;
            const searchTerm = els.searchInput.value.toLowerCase();
            
            const filteredBooks = store.books.filter(book => {
                const matchesFilter = activeFilter === 'all' || book.category === activeFilter;
                const matchesSearch = 
                    book.title.toLowerCase().includes(searchTerm) || 
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.price.toString().includes(searchTerm);
                
                return matchesFilter && matchesSearch;
            });
            
            ui.renderBooks(filteredBooks);
        },
        
        handleBookActions(e) {
            const bookId = parseInt(e.target.dataset.id);
            if (e.target.classList.contains("add-to-cart-btn")) {
                this.addToCart(bookId);
            } else if (e.target.classList.contains("show-detail-btn")) {
                const book = store.books.find(b => b.id === bookId);
                if (book) this.showBookDetail(book);
            }
        },
        
        addToCart(bookId) {
            const bookToAdd = store.books.find(book => book.id === bookId);
            const existingItem = store.cart.find(item => item.id === bookId);
            if (bookToAdd) {
                existingItem ? existingItem.quantity++ : store.cart.push({ ...bookToAdd, quantity: 1 });
                store.save();
                ui.renderCart();
                ui.showToast(`'${bookToAdd.title}' savatga qo'shildi!`, true);
            }
        },
        
        handleCartActions(e) {
            const bookId = parseInt(e.target.dataset.id);
            let cartItem = store.cart.find(item => item.id === bookId);
            if (!cartItem) return;
            if (e.target.classList.contains("quantity-increase")) {
                cartItem.quantity++;
            } else if (e.target.classList.contains("quantity-decrease")) {
                if (cartItem.quantity > 1) cartItem.quantity--;
                else store.cart = store.cart.filter(item => item.id !== bookId);
            } else if (e.target.classList.contains("remove-from-cart-btn")) {
                store.cart = store.cart.filter(item => item.id !== bookId);
                ui.showToast("Mahsulot savatdan olib tashlandi!", true);
            }
            store.save();
            ui.renderCart();
        },
        
        handleRegister(e) {
            e.preventDefault();
            const [name, email, password, confirmPassword] = Array.from(e.target.elements).map(el => el.value);
            if (password !== confirmPassword) return ui.showLocalMsg(els.registerMessage, "Parollar mos kelmaydi!", false);
            if (store.users.find(u => u.email === email)) return ui.showLocalMsg(els.registerMessage, "Bu email allaqachon ro'yxatdan o'tgan!", false);
            const newUser = { name, email, password };
            store.users.push(newUser);
            store.save();
            store.setLoggedInUser(newUser);
            ui.showLocalMsg(els.registerMessage, "Ro'yxatdan o'tish muvaffaqiyatli!", true);
            e.target.reset();
            setTimeout(() => {
                ui.hideModal(els.registerModal);
                ui.updateAuthUI();
                ui.showToast("Ro'yxatdan o'tish muvaffaqiyatli!", true);
                els.registerMessage.textContent = '';
            }, 1500);
        },
        
        handleLogin(e) {
            e.preventDefault();
            const [email, password] = Array.from(e.target.elements).map(el => el.value);
            const user = store.users.find(u => u.email === email && u.password === password);
            if (user) {
                store.setLoggedInUser(user);
                ui.showLocalMsg(els.loginMessage, "Kirish muvaffaqiyatli!", true);
                e.target.reset();
                setTimeout(() => {
                    ui.hideModal(els.loginModal);
                    ui.updateAuthUI();
                    ui.showToast("Xush kelibsiz!", true);
                    els.loginMessage.textContent = '';
                }, 1500);
            } else {
                ui.showLocalMsg(els.loginMessage, "Noto'g'ri email yoki parol!", false);
            }
        },
        
        handleLogout() {
            store.logout();
            ui.updateAuthUI();
            ui.showToast("Tizimdan muvaffaqiyatli chiqdingiz!", true);
        },
        
        checkInitialTheme() {
            const saved = localStorage.getItem('theme');
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            ui.setTheme(saved ? saved === 'light' : prefersLight);
        },
        
        handleThemeToggle() {
            const isLight = document.body.classList.toggle("light-mode");
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            ui.showToast(`Mavzu ${isLight ? 'yorugʻ' : 'qorongʻi'} rejimga o'zgartirildi!`, true);
        },
        
        handleOrderAll() {
            const user = store.getLoggedInUser();
            if (!user) {
                ui.showToast("Buyurtma berish uchun avval tizimga kiring.", false);
                ui.showModal(els.loginModal);
                return;
            }
            if (store.cart.length > 0) {
                ui.hideModal(document.getElementById('cart-modal'));
                ui.showModal(els.orderModal);
                const summary = store.cart.map(item => `• ${item.title} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm`).join("\n");
                document.getElementById("order-book-info").textContent = `Savatdagi barcha kitoblar:\n${summary}`;
            }
        },
        
        handleOrder(e) {
            e.preventDefault();
            const [name, phone, address, passport, note] = Array.from(e.target.elements).map(el => el.value);
            const TELEGRAM_BOT_TOKEN = "8231886168:AAEfamJvcFKQ_FGlr0jxagbylCPi9Qp2GXY";
            const TELEGRAM_CHAT_ID = "7803384869";
            const items = store.cart.map(item => `• ${item.title} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm`).join("\n");
            const totalPrice = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let message = `Yangi buyurtma!\n\n<b>Ism:</b> ${name}\n<b>Tel:</b> ${phone}\n<b>Manzil:</b> ${address}\n<b>Pasport:</b> ${passport}`;
            if (note.trim()) message += `\n<b>Eslatma:</b> ${note}`;
            message += `\n\n<b>Buyurtma ro'yxati:</b>\n${items}\n\n<b>Jami:</b> ${totalPrice.toLocaleString("uz-UZ")} so'm`;
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" })
            }).then(r => r.json()).then(data => {
                if (data.ok) {
                    ui.showLocalMsg(els.orderMessage, "Buyurtmangiz qabul qilindi!", true);
                    store.cart = []; store.save(); ui.renderCart(); e.target.reset();
                    ui.showToast("Buyurtmangiz muvaffaqiyatli yuborildi!", true);
                    setTimeout(() => { ui.hideModal(els.orderModal); els.orderMessage.textContent = ''; }, 3000);
                } else {
                    ui.showLocalMsg(els.orderMessage, "Xatolik yuz berdi.", false);
                }
            }).catch(() => ui.showLocalMsg(els.orderMessage, "Tarmoq xatosi.", false));
        },

        showBookDetail(book) {
            els.detailImage.src = book.image;
            els.detailTitle.textContent = book.title;
            els.detailAuthor.textContent = book.author;
            els.detailCategory.textContent = book.category.charAt(0).toUpperCase() + book.category.slice(1);
            els.detailPrice.textContent = `${book.price.toLocaleString("uz-UZ")} so'm`;
            els.detailDescription.textContent = book.description || "Tavsif mavjud emas.";
            
            // Kitob tafsilotlarini ko'rsatish
            ui.renderBookDetails(book);
            
            ui.showModal(els.detailModal);
        }
    };
    
    // =================================================================
    // 5. ISHGA TUSHIRISH
    // =================================================================
    app.init();
}); 