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

    loginBtn: document.getElementById("login-btn"),
    registerBtn: document.getElementById("register-btn"),

    scrollToTop: document.querySelectorAll(".scroll-to-top"),
    scrollToProducts: document.querySelectorAll(".scroll-to-products"),
    
    newsLink: document.getElementById("news-link"),
    hitSaleLink: document.getElementById("hit-sale-link"),
  };

  // =================================================================
  // 2. MA'LUMOTLAR SAQLASH VA BOSHQARISH
  // =================================================================
  const store = {
    toys: [],
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    users: JSON.parse(localStorage.getItem("users")) || [],
    theme: localStorage.getItem("theme") || "dark",

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
        console.log(`Mahsulotlar yuklandi: ${this.toys.length} ta`);
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
    // 2.8 YANGI MAHSULOTLAR
    // =================================================================
    getNewProducts() {
      return this.toys.filter(toy => toy.isNew === true);
    },

    // =================================================================
    // 2.9 HIT SAVDO MAHSULOTLARI
    // =================================================================
    getHitProducts() {
      return this.toys.filter(toy => toy.isHit === true);
    },

    // =================================================================
    // 2.10 FILTRLANGAN MAHSULOTLAR
    // =================================================================
    getFiltered() {
      const activeFilter =
        document.querySelector(".filter-item.active")?.dataset.filter || "all";
      const search = (els.searchInput.value || "").toLowerCase().trim();

      let filteredToys = this.toys;
      
      // Maxsus filtrlarni qo'llash
      if (activeFilter === "new") {
        filteredToys = this.getNewProducts();
      } else if (activeFilter === "hit") {
        filteredToys = this.getHitProducts();
      } else if (activeFilter !== "all") {
        filteredToys = this.toys.filter(b => 
          String(b.category || "").toLowerCase() === activeFilter.toLowerCase()
        );
      }

      // Qidiruv bo'yicha filtr
      if (search) {
        filteredToys = filteredToys.filter((b) => {
          return b.title.toLowerCase().includes(search) ||
                 (b.brand || "").toLowerCase().includes(search) ||
                 String(b.price).includes(search);
        });
      }

      return filteredToys;
    },

    // =================================================================
    // 2.11 MAHSULOT RASMLARINI OLISH - JSON DAN
    // =================================================================
    getToyImages(id) {
      const toy = this.toys.find(t => t.id === id);
      return toy && toy.images ? toy.images : [];
    }
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
        
        // Badge HTML
        let badges = '';
        if (b.isNew) {
          badges += '<span class="new-badge">YANGI</span>';
        } else if (b.isHit) {
          badges += '<span class="hit-badge">HIT</span>';
        }
        if (b.discount > 0) {
          badges += `<span class="discount-badge">${b.discount}%</span>`;
        }
        
        // Narx HTML
        let priceHTML = '';
        if (b.originalPrice && b.discount > 0) {
          priceHTML = `
            <div class="price-container">
              <span class="original-price">${b.originalPrice.toLocaleString("uz-UZ")} so'm</span>
              <span class="current-price">${b.price.toLocaleString("uz-UZ")} so'm</span>
            </div>
          `;
        } else {
          priceHTML = `<p class="product-price">${b.price.toLocaleString("uz-UZ")} so'm</p>`;
        }
        
        card.innerHTML = `
          ${badges}
          <img src="${b.image}" alt="${b.title}" class="product-img" data-detail-id="${b.id}">
          <h3 class="product-title" data-detail-id="${b.id}">${b.title}</h3>
          <p class="product-brand">${b.brand || ""}</p>
          <p class="product-desc muted">${shortDesc}</p>
          ${priceHTML}
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
      els.filterOptions.innerHTML = "";

      // "Barcha mahsulotlar" tugmasi
      const all = document.createElement("div");
      all.className = "filter-item active";
      all.dataset.filter = "all";
      all.textContent = "Barcha o'yinchoqlar";
      els.filterOptions.appendChild(all);

      // Asosiy kategoriyalar
      const mainCategories = [
        "Konstruktor",
        "Qo'g'irchoqlar", 
        "Yumshoq o'yinchoqlar",
        "Mashinalar",
        "Ta'limiy",
        "Jumboqlar",
        "Figuralar"
      ];
      
      mainCategories.forEach(c => {
        const d = document.createElement("div");
        d.className = "filter-item";
        d.dataset.filter = c;
        d.textContent = c;
        els.filterOptions.appendChild(d);
      });
      
      // Yangiliklar tugmasi
      const newBtn = document.createElement("div");
      newBtn.className = "filter-item";
      newBtn.dataset.filter = "new";
      newBtn.innerHTML = '<i class="fa-solid fa-newspaper"></i> Yangiliklar';
      els.filterOptions.appendChild(newBtn);
      
      // Xit savdo tugmasi
      const hit = document.createElement("div");
      hit.className = "filter-item";
      hit.dataset.filter = "hit";
      hit.innerHTML = '<i class="fa-solid fa-fire"></i> Xit savdo';
      els.filterOptions.appendChild(hit);
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
              <img src="${it.image}" alt="${
            it.title
          }" class="cart-item__img">
              <div class="cart-item__details">
                <p class="cart-item__title">${it.title}</p>
                <p class="cart-item__price">${(
                  it.price * it.quantity
                ).toLocaleString("uz-UZ")} so'm</p>
              </div>
              <div class="cart-item__actions">
                <div class="quantity-control">
                  <button class="quantity-decrease" data-id="${
                    it.id
                  }">-</button>
                  <span>${it.quantity}</span>
                  <button class="quantity-increase" data-id="${
                    it.id
                  }">+</button>
                </div>
                <button class="remove-from-cart-btn" data-id="${
                  it.id
                }">×</button>
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
    // 3.4 MAHSULOT DETALLARI SLIDERINI CHIQARISH
    // =================================================================
    renderToySlider(id) {
      const images = store.getToyImages(id);
      
      // Agar rasm yo'q bo'lsa, asosiy rasmdan foydalanamiz
      if (images.length === 0) {
        const toy = store.toys.find(t => t.id === id);
        if (toy && toy.image) {
          images.push(toy.image);
        }
      }
      
      // Slider HTML yaratish
      const sliderHTML = `
        <div class="toy-detail-slider">
          <div class="slider-container">
            <div class="slider-track">
              ${images.map(img => `
                <div class="slider-slide">
                  <img src="${img}" alt="Mahsulot rasmi">
                </div>
              `).join('')}
            </div>
            ${images.length > 1 ? `
              <button class="slider-btn slider-btn--prev">‹</button>
              <button class="slider-btn slider-btn--next">›</button>
            ` : ''}
          </div>
          ${images.length > 1 ? `
            <div class="slider-dots">
              ${images.map((_, index) => `
                <div class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
      
      return { html: sliderHTML, imagesCount: images.length };
    },

    // =================================================================
    // 3.5 SLIDER BOSHQARUVI
    // =================================================================
    initSlider(sliderElement) {
      if (!sliderElement) return;
      
      const track = sliderElement.querySelector('.slider-track');
      const slides = sliderElement.querySelectorAll('.slider-slide');
      const prevBtn = sliderElement.querySelector('.slider-btn--prev');
      const nextBtn = sliderElement.querySelector('.slider-btn--next');
      const dots = sliderElement.querySelectorAll('.slider-dot');
      
      if (!track || slides.length <= 1) return;
      
      let currentSlide = 0;
      const totalSlides = slides.length;
      
      const updateSlider = () => {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Dotslarni yangilash
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
        
        // Tugmalarni yangilash
        if (prevBtn) prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        if (nextBtn) nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
      };
      
      // Oldingi rasm
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
          }
        });
      }
      
      // Keyingi rasm
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
          }
        });
      }
      
      // Dotlar
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentSlide = index;
          updateSlider();
        });
      });
      
      // Avtomatik scroll (ixtiyoriy)
      let slideInterval = setInterval(() => {
        if (currentSlide < totalSlides - 1) {
          currentSlide++;
        } else {
          currentSlide = 0;
        }
        updateSlider();
      }, 5000);
      
      // Paus qilish hover paytida
      sliderElement.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      sliderElement.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
          if (currentSlide < totalSlides - 1) {
            currentSlide++;
          } else {
            currentSlide = 0;
          }
          updateSlider();
        }, 5000);
      });
      
      // Boshlang'ich holat
      updateSlider();
    },

    // =================================================================
    // 3.6 MAHSULOT TAFSILOTLARINI CHIQARISH
    // =================================================================
    renderToyDetails(b) {
      // Asosiy ma'lumotlar
      els.detailTitle.textContent = b.title || "";
      els.detailBrand.textContent = b.brand || "";
      els.detailCategory.textContent = b.category || "";
      
      // Narx ko'rsatish
      let priceHTML = '';
      if (b.originalPrice && b.discount > 0) {
        priceHTML = `
          <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0;">
            <span style="text-decoration: line-through; color: var(--muted); font-size: 20px;">
              ${b.originalPrice.toLocaleString("uz-UZ")} so'm
            </span>
            <span style="color: var(--danger); font-weight: bold; font-size: 26px;">
              ${b.price.toLocaleString("uz-UZ")} so'm
            </span>
            <span style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #333; padding: 5px 10px; border-radius: 20px; font-weight: bold;">
              ${b.discount}% chegirma
            </span>
          </div>
        `;
      } else {
        priceHTML = `<p class="toy-detail__price">${b.price.toLocaleString("uz-UZ")} so'm</p>`;
      }
      els.detailPrice.innerHTML = priceHTML;
      
      els.detailDescription.textContent = b.description || "";
      
      // Slider yaratish
      const sliderData = this.renderToySlider(b.id);
      els.toyDetailsList.innerHTML = sliderData.html;
      
      // Sliderni ishga tushirish
      setTimeout(() => {
        const sliderElement = els.toyDetailsList.querySelector('.toy-detail-slider');
        if (sliderElement && sliderData.imagesCount > 1) {
          this.initSlider(sliderElement);
        }
      }, 100);
      
      // Tafsilotlar ro'yxati
      const details = [];
      if (b.brand) details.push(["Brend", b.brand]);
      if (b.category) details.push(["Kategoriya", b.category]);
      if (b.isNew) details.push(["Holati", "Yangi mahsulot"]);
      if (b.isHit) details.push(["Holati", "Hit mahsulot"]);
      if (b.discount > 0) details.push(["Chegirma", `${b.discount}%`]);
      details.push(["Narxi", `${b.price.toLocaleString("uz-UZ")} so'm`]);
      
      const detailsHTML = details
        .map(
          ([label, value]) => `
            <div class="toy-detail-item">
              <span class="toy-detail-label">${label}:</span>
              <span class="toy-detail-value">${value}</span>
            </div>
          `
        )
        .join("");
      
      // Tafsilotlarni qo'shamiz
      if (detailsHTML) {
        els.toyDetailsList.innerHTML += `
          <div class="toy-details">
            ${detailsHTML}
          </div>
        `;
      }
    },

    // =================================================================
    // 3.7 MODALNI KO'RSATISH
    // =================================================================
    showModal(modal) {
      if (!modal) return;
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    },

    // =================================================================
    // 3.8 MODALNI YASHIRISH
    // =================================================================
    hideModal(modal) {
      if (!modal) return;
      modal.classList.remove("show");
      document.body.style.overflow = "";
    },

    // =================================================================
    // 3.9 XABAR KO'RSATISH - IKKALA JOYDA HAM
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
    // 3.10 AUTENTIFIKATSIYA INTERFEYSI
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
    // 3.11 BANNER BOSHQARUVI - TO'G'RI ISHLAYDI
    // =================================================================
    toggleBanner(show) {
      if (!els.banner) return;

      if (show) {
        // Banner ko'rsatish
        els.banner.style.display = "flex";
      } else {
        // Banner yashirish
        els.banner.style.display = "none";
      }
    },
  };

  // =================================================================
  // 4. EVENT HANDLERLAR
  // =================================================================

  // =================================================================
  // 4.1 FILTR TUGMALARI HANDLERI
  // =================================================================
  function filterClickHandler(e) {
    const item = e.target.closest(".filter-item");
    if (!item) return;

    // Faqat bitta aktiv filtr
    document.querySelectorAll(".filter-item").forEach((it) => {
      it.classList.remove("active");
    });
    item.classList.add("active");

    // Yangiliklar bosilganda
    if (item.dataset.filter === "new") {
      const newProducts = store.getNewProducts();
      ui.renderToys(newProducts);
      ui.showToast("Yangi mahsulotlar ko'rsatilmoqda!", true, "top");
    } 
    // Xit savdo bosilganda
    else if (item.dataset.filter === "hit") {
      const hitProducts = store.getHitProducts();
      ui.renderToys(hitProducts);
      ui.showToast("Eng mashhur o'yinchoqlar ko'rsatilmoqda!", true, "top");
    } 
    // Boshqa filtrlarda
    else {
      ui.renderToys(store.getFiltered());
    }
  }

  // =================================================================
  // 4.2 QIDIRUV HANDLERI - TO'G'RI ISHLAYDI
  // =================================================================
  function searchHandler() {
    const searchText = (els.searchInput.value || "").trim();

    // Mahsulotlarni filtrlash
    ui.renderToys(store.getFiltered());

    // Banner boshqaruvi
    if (searchText) {
      // Qidiruv matni bor - banner yashirish
      ui.toggleBanner(false);
    } else {
      // Qidiruv matni yo'q - banner ko'rsatish
      ui.toggleBanner(true);
    }
  }

  // =================================================================
  // 4.3 MAHSULOTLAR RO'YXATI EVENTLARI
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
  // 4.4 SAVAT EVENTLARI
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
  // 4.5 MODAL OCHISH
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
  // 4.6 MODAL YOPISH
  // =================================================================
  document.querySelectorAll(".close-modal").forEach((close) => {
    close.addEventListener("click", (ev) => {
      const modal = ev.target.closest(".modal-overlay");
      ui.hideModal(modal);
    });
  });

  // =================================================================
  // 4.7 MODAL OVERLAY BOSILGANDA YOPISH
  // =================================================================
  els.modals.forEach((m) => {
    m.addEventListener("click", (ev) => {
      if (ev.target === m) {
        ui.hideModal(m);
      }
    });
  });

  // =================================================================
  // 4.8 RO'YXATDAN O'TISH FORMASI
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
  // 4.9 KIRISH FORMASI
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
  // 4.10 BUYURTMA FORMASI - TO'LIQ ISHLAYDI
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
      const name = formData.get("name");
      const phone = formData.get("phone");
      const address = formData.get("address");
      const email = formData.get("email");
      const note = formData.get("note");

      // To'lov usulini olish
      const paymentMethod = document.querySelector(
        'input[name="payment-method"]:checked'
      ).value;
      const paymentMethods = {
        payme: "Payme",
        uzumbank: "Uzum Bank",
        naqd: "Naqd pul",
      };
      const paymentMethodName = paymentMethods[paymentMethod];

      // Buyurtma ma'lumotlari
      const items = store.cart
        .map(
          (it) =>
            `• ${it.title} (${it.quantity} ta) - ${(
              it.price * it.quantity
            ).toLocaleString("uz-UZ")} so'm`
        )
        .join("\n");

      const total = store.getTotal();

      // Xabar ko'rsatish
      ui.showToast(
        `Buyurtma qabul qilindi! To'lov usuli: ${paymentMethodName}`,
        true,
        "bottom"
      );

      // Ma'lumotlarni consolega chiqarish (haqiqiy loyihada serverga yuboriladi)
      console.log("Buyurtma ma'lumotlari:", {
        name,
        phone,
        address,
        email,
        note,
        paymentMethod: paymentMethodName,
        items: store.cart,
        total: total,
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
  // 4.11 SAVATDAGI BARCHA MAHSULOTLARNI BUYURTMA QILISH
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
            `• ${it.title} (${it.quantity}) - ${(
              it.price * it.quantity
            ).toLocaleString("uz-UZ")} so'm`
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
  // 4.12 TEMA O'ZGARTIRISH
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
  // 4.13 CHIQISH TUGMASI
  // =================================================================
  if (els.logoutBtn) {
    els.logoutBtn.addEventListener("click", () => {
      store.logout();
      ui.updateAuthUI();
      ui.showToast("Chiqish muvaffaqiyatli", true, "top");
    });
  }

  // =================================================================
  // 4.14 SCROLL EVENTLARI
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
  // 4.15 KATALOGGA SCROLL QILISH
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
  // 4.16 TELEFON RAQAMI FORMATA
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
  // 4.17 FILTER LINKLARI UCHUN HANDLER
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

      // Maxsus filtrlarni qo'llash
      if (filter === "new") {
        const newProducts = store.getNewProducts();
        ui.renderToys(newProducts);
        ui.showToast("Yangi mahsulotlar ko'rsatilmoqda!", true, "top");
      } else if (filter === "hit") {
        const hitProducts = store.getHitProducts();
        ui.renderToys(hitProducts);
        ui.showToast("Eng mashhur o'yinchoqlar ko'rsatilmoqda!", true, "top");
      } else {
        ui.renderToys(store.getFiltered());
      }

      // Katalogga scroll qilish
      const catalogAnchor = document.getElementById("catalog-anchor");
      if (catalogAnchor) {
        catalogAnchor.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  // =================================================================
  // 4.18 NAVIGATSIYA LINKLARI UCHUN HANDLER
  // =================================================================
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("scroll-to-top") ||
      e.target.classList.contains("scroll-to-products")
    ) {
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
  // 4.19 YANGILIKLAR TUGMASI UCHUN HANDLER
  // =================================================================
  if (els.newsLink) {
    els.newsLink.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Filtrni o'rnatish
      document.querySelectorAll(".filter-item").forEach((item) => {
        item.classList.remove("active");
        if (item.dataset.filter === "new") {
          item.classList.add("active");
        }
      });

      // Yangi mahsulotlarni ko'rsatish
      const newProducts = store.getNewProducts();
      ui.renderToys(newProducts);
      
      // Katalogga scroll qilish
      const catalogAnchor = document.getElementById("catalog-anchor");
      if (catalogAnchor) {
        catalogAnchor.scrollIntoView({ behavior: "smooth" });
      }
      
      ui.showToast("Yangi mahsulotlar ko'rsatilmoqda!", true, "top");
    });
  }

  // =================================================================
  // 4.20 XIT SAVDO TUGMASI UCHUN HANDLER
  // =================================================================
  if (els.hitSaleLink) {
    els.hitSaleLink.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Filtrni o'rnatish
      document.querySelectorAll(".filter-item").forEach((item) => {
        item.classList.remove("active");
        if (item.dataset.filter === "hit") {
          item.classList.add("active");
        }
      });

      // Xit savdo mahsulotlarini ko'rsatish
      const hitProducts = store.getHitProducts();
      ui.renderToys(hitProducts);
      
      // Katalogga scroll qilish
      const catalogAnchor = document.getElementById("catalog-anchor");
      if (catalogAnchor) {
        catalogAnchor.scrollIntoView({ behavior: "smooth" });
      }
      
      ui.showToast("Eng mashhur o'yinchoqlar ko'rsatilmoqda!", true, "top");
    });
  }

  // =================================================================
  // 5. EVENT LISTENERLARNI ULASH
  // =================================================================
  els.filterOptions.addEventListener("click", filterClickHandler);
  els.searchInput.addEventListener("input", searchHandler);

  // =================================================================
  // 6. DASTURNI ISHGA TUSHIRISH - BANNER TO'G'RI ISHLASHI UCHUN
  // =================================================================
  (async function startup() {
    // Ma'lumotlarni yuklash
    await store.load();

    // Interfeysni yangilash
    ui.renderCategories();
    ui.renderToys(store.toys);
    ui.renderCart();
    ui.updateAuthUI();

    // Banner dastlab ko'rsatiladi
    ui.toggleBanner(true);

    // Mavzuni sozlash
    if (store.theme === "light") {
      document.body.classList.add("light-mode");
    }

    // Test xabari
    setTimeout(() => {
      ui.showToast("TOy STore-ga xush kelibsiz! Yangiliklar va Xit savdolarimizni ko'rib chiqing.", true, "bottom");
    }, 1000);

    console.log("TOy STore tayyor! JSON dan rasmlar yuklandi.");

  })();

  
});