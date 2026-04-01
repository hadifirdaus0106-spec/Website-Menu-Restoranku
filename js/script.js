// Data menu (sama seperti sebelumnya)
const menuData = [
  // Makanan
  {
    id: 1,
    name: "Nasi Goreng",
    description: "Nasi goreng, bumbu special, dan aneka toping basic",
    price: 25000,
    category: "makanan",
    image: "image/nasi-goreng.jpg",
  },
  {
    id: 2,
    name: "Mie Ayam",
    description: "Mie + ayam dengan perpaduan sempurna",
    price: 12000,
    category: "makanan",
    image: "image/mie-ayam.jpg",
  },
  {
    id: 3,
    name: "Bakso",
    description: "Soo Baksooo",
    price: 15000,
    category: "makanan",
    image: "image/bakso.jpg",
  },
  {
    id: 4,
    name: "Pecel Lele",
    description: "Salad enak dengan lauk ikan",
    price: 30000,
    category: "makanan",
    image: "image/pecel-lele.jpg",
  },
  // Minuman
  {
    id: 5,
    name: "Es Teh",
    description: "Minuman sejuta umat, dengan harga terjangkau!",
    price: 5000,
    category: "minuman",
    image: "image/es-teh.jpg",
  },
  {
    id: 6,
    name: "Es Jeruk Nipis",
    description: "Minuman asam manis segar",
    price: 8000,
    category: "minuman",
    image: "image/es-jeruk.jpg",
  },
  {
    id: 7,
    name: "Red Velvet",
    description: "Merah merona segarkan dahaga",
    price: 22000,
    category: "minuman",
    image: "image/red-valvet.jpg",
  },
  {
    id: 8,
    name: "Kopi Susu",
    description: "Perpaduan nikmat Kopi dan susu",
    price: 15000,
    category: "minuman",
    image: "image/kopi-susu.jpg",
  },
  // Pencuci mulut
  {
    id: 9,
    name: "Pudding Jelly",
    description: "Kenyal-kenyal dan lembut manis dimulut",
    price: 27000,
    category: "dessert",
    image: "image/pudding-jelly.jpg",
  },
  {
    id: 10,
    name: "Kentang Goreng",
    description: "Cemilan cocok sambil nungguin hidangan lainnya",
    price: 17000,
    category: "dessert",
    image: "image/kentang-goreng.jpg",
  },
  {
    id: 11,
    name: "Pisang Coklat",
    description: "Cemilan enak dan manis sambilan santay",
    price: 18000,
    category: "dessert",
    image: "image/pisang-coklat.jpg",
  },
  {
    id: 12,
    name: "Nugget Sosis",
    description: "Cemilan terhangat untuk hidangan santay",
    price: 25000,
    category: "dessert",
    image: "image/sosis-nugget.jpg",
  },
];

// State filter aktif
let activeFilter = "all";
let searchTerm = "";

// State keranjang
let cart = [];

// State untuk promo
let appliedPromo = null;
let promoDiscount = 0;

// State favorite carts
let favoriteCarts = [];

// ========== FUNGSI MENU ==========

// Fungsi penampilan menu
function displayMenu(menuArray) {
  const menuGrid = document.getElementById("menuGrid");

  if (menuArray.length === 0) {
    menuGrid.innerHTML = '<p class="no-menu">Tidak ada menu yang ditampilkan</p>';
    return;
  }

  menuGrid.innerHTML = menuArray
    .map(
      (item) => `
        <div class="menu-card" data-id="${item.id}">
            <div class="menu-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${item.name}'">
            </div>
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p class="menu-description">${item.description}</p>
                <div class="menu-footer">
                    <span class="menu-price">Rp ${item.price.toLocaleString("id-ID")}</span>
                    <span class="menu-category">${item.category}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id}, true)">
                    <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Fungsi untuk filter menu tergantung kategorinya
function filterMenu(category, event) {
  activeFilter = category;

  // Update tombol aktifasi
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Filter daftar
  filterAndSearchMenu();
}

// Fungsi search menu
function searchMenu() {
  searchTerm = document.getElementById("searchInput").value.toLowerCase();
  filterAndSearchMenu();
}

// Fungsi untuk menggabungkan filter dan search
function filterAndSearchMenu() {
  let filteredMenu = menuData;

  // Filter berdasarkan kategori
  if (activeFilter !== "all") {
    filteredMenu = filteredMenu.filter(
      (item) => item.category === activeFilter,
    );
  }

  // Filter berdasarkan search
  if (searchTerm !== "") {
    filteredMenu = filteredMenu.filter(
      (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm),
    );
  }

  displayMenu(filteredMenu);
}

// Fungsi scroll menu
function scrollToMenu() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}

// Fungsi menu mobile
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  navMenu.classList.toggle("active");
}

// ========== FITUR KERANJANG ==========

// Fungsi untuk menambah item ke keranjang
function addToCart(itemId, keepCartOpen = false) {
  const item = menuData.find(menu => menu.id === itemId);
  if (!item) return;

  const existingItem = cart.find(cartItem => cartItem.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  }

  updateCartDisplay();
  showNotification(`${item.name} ditambahkan ke keranjang!`, 'success');
  saveCartToStorage();
  
  // Keranjang tidak langsung tertutup
  if (!keepCartOpen) {
    // Optional: animasi kecil pada cart toggle
    const cartToggle = document.querySelector('.cart-toggle');
    cartToggle.style.animation = 'none';
    setTimeout(() => {
      cartToggle.style.animation = 'pulse 2s infinite';
    }, 10);
  }
}

// Fungsi untuk mengurangi quantity
function decreaseQuantity(itemId) {
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    updateCartDisplay();
    saveCartToStorage();
    resetPromo();
  }
}

// Fungsi untuk menambah quantity
function increaseQuantity(itemId) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += 1;
    updateCartDisplay();
    saveCartToStorage();
    resetPromo();
  }
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(itemId) {
  const item = cart.find(item => item.id === itemId);
  cart = cart.filter(item => item.id !== itemId);
  updateCartDisplay();
  showNotification(`${item.name} dihapus dari keranjang!`, 'info');
  saveCartToStorage();
  resetPromo();
}

// Fungsi untuk mengosongkan keranjang
function clearCart() {
  if (cart.length === 0) {
    showNotification('Keranjang sudah kosong!', 'info');
    return;
  }
  
  if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
    cart = [];
    appliedPromo = null;
    promoDiscount = 0;
    updateCartDisplay();
    showNotification('Keranjang telah dikosongkan!', 'info');
    saveCartToStorage();
  }
}

// Fungsi untuk menghitung total dengan promo
function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // PPN 10%
  let total = subtotal + tax;
  
  // Apply promo discount jika ada
  if (appliedPromo === 'POLBEL20' && subtotal >= 100000) {
    promoDiscount = subtotal * 0.2;
    total = subtotal + tax - promoDiscount;
  } else if (appliedPromo === 'BUY2GET1' && cart.length >= 3) {
    // Beli 2 gratis 1 (diskon untuk item termurah)
    const foodItems = cart.filter(item => {
      const menuItem = menuData.find(m => m.id === item.id);
      return menuItem && menuItem.category === 'makanan';
    });
    if (foodItems.length >= 3) {
      const sortedByPrice = [...foodItems].sort((a, b) => a.price - b.price);
      promoDiscount = sortedByPrice[0].price;
      total = subtotal + tax - promoDiscount;
    }
  } else {
    promoDiscount = 0;
  }
  
  return { subtotal, tax, total, discount: promoDiscount };
}

// Fungsi reset promo
function resetPromo() {
  appliedPromo = null;
  promoDiscount = 0;
  updateCartDisplay();
}

// Fungsi untuk update tampilan keranjang
function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.getElementById('cartTotal');
  const cartTax = document.getElementById('cartTax');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const cartItemCount = document.getElementById('cartItemCount');
  
  const { subtotal, tax, total, discount } = calculateTotals();
  
  // Update jumlah item di toggle
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  if (cartItemCount) cartItemCount.textContent = `(${totalItems} item)`;
  
  // Update totals
  if (cartTotal) cartTotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
  if (cartTax) cartTax.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
  if (cartGrandTotal) {
    if (discount > 0) {
      cartGrandTotal.innerHTML = `Rp ${total.toLocaleString('id-ID')} <small style="font-size:0.7rem; color:#28a745;">(Diskon: Rp ${discount.toLocaleString('id-ID')})</small>`;
    } else {
      cartGrandTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
  }
  
  // Tampilkan item di keranjang
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Keranjang masih kosong</p><p>Silakan pilih menu favorit Anda!</p></div>';
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/60?text=${item.name}'">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</span>
            <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
              <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

// Fungsi untuk toggle keranjang
function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.querySelector('.cart-overlay');
  
  if (cartSidebar && overlay) {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when cart is open
    if (cartSidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
}

// Fungsi untuk notifikasi
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}

// ========== FITUR PROMO ==========

// Buka modal promo
function openPromoModal() {
  const modal = document.getElementById('promoModal');
  if (modal) {
    modal.classList.add('active');
  }
}

// Tutup modal promo
function closePromoModal() {
  const modal = document.getElementById('promoModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// ========== FITUR FAVORITE ==========

// Simpan keranjang sebagai favorit
function saveCartAsFavorite() {
  if (cart.length === 0) {
    showNotification('Tidak ada pesanan untuk disimpan!', 'info');
    return;
  }
  
  const favoriteName = prompt('Beri nama untuk pesanan favorit ini:', `Pesanan ${new Date().toLocaleDateString()}`);
  if (!favoriteName) return;
  
  const favorite = {
    id: Date.now(),
    name: favoriteName,
    items: [...cart],
    createdAt: new Date().toISOString()
  };
  
  favoriteCarts.push(favorite);
  saveFavoritesToStorage();
  showNotification('Pesanan berhasil disimpan ke favorit!', 'success');
  openFavoriteModal();
}

// Buka modal favorit
function openFavoriteModal() {
  const modal = document.getElementById('favoriteModal');
  if (!modal) return;
  
  const favoriteList = document.getElementById('favoriteList');
  if (favoriteCarts.length === 0) {
    favoriteList.innerHTML = '<p style="text-align:center; color:#999;">Belum ada pesanan favorit</p>';
  } else {
    favoriteList.innerHTML = favoriteCarts.map(fav => `
      <div class="favorite-item">
        <div class="favorite-info">
          <h4>${fav.name}</h4>
          <p>${new Date(fav.createdAt).toLocaleDateString('id-ID')}</p>
          <p>${fav.items.length} item • Rp ${fav.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString('id-ID')}</p>
        </div>
        <div class="favorite-actions">
          <button onclick="loadFavorite(${fav.id})" class="add-favorite" title="Gunakan pesanan ini">
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button onclick="deleteFavorite(${fav.id})" class="remove-favorite" title="Hapus favorit">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }
  
  modal.classList.add('active');
}

// Tutup modal favorit
function closeFavoriteModal() {
  const modal = document.getElementById('favoriteModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Muat favorit ke keranjang
function loadFavorite(favoriteId) {
  const favorite = favoriteCarts.find(f => f.id === favoriteId);
  if (!favorite) return;
  
  if (confirm(`Muat pesanan "${favorite.name}" ke keranjang?`)) {
    cart = JSON.parse(JSON.stringify(favorite.items));
    updateCartDisplay();
    saveCartToStorage();
    showNotification(`Pesanan "${favorite.name}" berhasil dimuat!`, 'success');
    closeFavoriteModal();
  }
}

// Hapus favorit
function deleteFavorite(favoriteId) {
  if (confirm('Hapus pesanan favorit ini?')) {
    favoriteCarts = favoriteCarts.filter(f => f.id !== favoriteId);
    saveFavoritesToStorage();
    openFavoriteModal();
    showNotification('Pesanan favorit dihapus!', 'info');
  }
}

// ========== FITUR CHECKOUT ==========

// Buka modal checkout
function openCheckoutModal() {
  if (cart.length === 0) {
    showNotification('Keranjang masih kosong!', 'info');
    return;
  }
  
  const { subtotal, tax, total, discount } = calculateTotals();
  const modal = document.getElementById('checkoutModal');
  const checkoutDetails = document.getElementById('checkoutDetails');
  
  if (checkoutDetails) {
    checkoutDetails.innerHTML = `
      <div class="checkout-summary">
        <h4>Ringkasan Pesanan:</h4>
        ${cart.map(item => `
          <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
          </div>
        `).join('')}
        <div class="checkout-item">
          <span>Subtotal:</span>
          <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div class="checkout-item">
          <span>PPN (10%):</span>
          <span>Rp ${tax.toLocaleString('id-ID')}</span>
        </div>
        ${discount > 0 ? `
          <div class="checkout-item" style="color:#28a745;">
            <span>Diskon:</span>
            <span>-Rp ${discount.toLocaleString('id-ID')}</span>
          </div>
        ` : ''}
        <div class="checkout-total">
          <span>Total Pembayaran:</span>
          <span>Rp ${total.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <div class="promo-input">
        <input type="text" id="promoCode" placeholder="Masukkan kode promo" value="${appliedPromo || ''}">
        <button onclick="applyPromoCode()">Terapkan</button>
      </div>
      <div id="promoFeedback" class="promo-feedback"></div>
    `;
  }
  
  modal.classList.add('active');
}

// Terapkan kode promo
function applyPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const promoFeedback = document.getElementById('promoFeedback');
  const code = promoInput.value.trim().toUpperCase();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (code === 'POLBEL20') {
    if (subtotal >= 100000) {
      appliedPromo = code;
      promoFeedback.innerHTML = '<span class="promo-feedback success">✓ Kode promo berhasil diterapkan! Diskon 20%</span>';
      updateCartDisplay();
      // Update checkout modal
      setTimeout(() => {
        openCheckoutModal();
      }, 500);
    } else {
      promoFeedback.innerHTML = '<span class="promo-feedback error">✗ Minimal pembelian Rp 100.000 untuk promo ini</span>';
    }
  } else if (code === 'BUY2GET1') {
    const foodItems = cart.filter(item => {
      const menuItem = menuData.find(m => m.id === item.id);
      return menuItem && menuItem.category === 'makanan';
    });
    if (foodItems.length >= 3) {
      appliedPromo = code;
      promoFeedback.innerHTML = '<span class="promo-feedback success">✓ Kode promo berhasil diterapkan! Beli 2 Gratis 1</span>';
      updateCartDisplay();
      setTimeout(() => {
        openCheckoutModal();
      }, 500);
    } else {
      promoFeedback.innerHTML = '<span class="promo-feedback error">✗ Minimal 3 item makanan untuk promo ini</span>';
    }
  } else if (code === '') {
    appliedPromo = null;
    promoFeedback.innerHTML = '';
    updateCartDisplay();
    setTimeout(() => {
      openCheckoutModal();
    }, 500);
  } else {
    promoFeedback.innerHTML = '<span class="promo-feedback error">✗ Kode promo tidak valid</span>';
  }
}

// Tutup modal checkout
function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Konfirmasi checkout ke WhatsApp
function confirmCheckout() {
  const { subtotal, tax, total, discount } = calculateTotals();
  
  let orderSummary = "🍽️ *PESANAN SAYA*\n\n";
  cart.forEach(item => {
    orderSummary += `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
  });
  orderSummary += `\n📦 *Subtotal:* Rp ${subtotal.toLocaleString('id-ID')}`;
  orderSummary += `\n🧾 *PPN (10%):* Rp ${tax.toLocaleString('id-ID')}`;
  if (discount > 0) {
    orderSummary += `\n🎉 *Diskon:* Rp ${discount.toLocaleString('id-ID')}`;
  }
  orderSummary += `\n💰 *Total Pembayaran:* Rp ${total.toLocaleString('id-ID')}`;
  
  // Tambahkan informasi pelanggan
  const customerName = prompt('Masukkan nama Anda untuk pesanan:', '');
  if (customerName) {
    orderSummary = `👤 *Nama:* ${customerName}\n${orderSummary}`;
  }
  
  // Tambahan catatan
  const notes = prompt('Tambahkan catatan untuk pesanan (opsional):', '');
  if (notes) {
    orderSummary += `\n\n📝 *Catatan:* ${notes}`;
  }
  
  const encodedMessage = encodeURIComponent(orderSummary);
  const phoneNumber = "6281990101270";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  closeCheckoutModal();
  toggleCart(); // Tutup keranjang
  
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    showNotification('Mengalihkan ke WhatsApp...', 'success');
  }, 300);
}

// ========== STORAGE FUNCTIONS ==========

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCartToStorage() {
  localStorage.setItem('restoCart', JSON.stringify(cart));
}

// Fungsi untuk memuat keranjang dari localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('restoCart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }
}

// Fungsi untuk menyimpan favorit ke localStorage
function saveFavoritesToStorage() {
  localStorage.setItem('restoFavorites', JSON.stringify(favoriteCarts));
}

// Fungsi untuk memuat favorit dari localStorage
function loadFavoritesFromStorage() {
  const savedFavorites = localStorage.getItem('restoFavorites');
  if (savedFavorites) {
    try {
      favoriteCarts = JSON.parse(savedFavorites);
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  }
}

// ========== EVENT LISTENERS ==========

// Listener mobile menu
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  // Tutup mobile menu ketika diklik link
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector(".nav-menu")?.classList.remove("active");
    });
  });

  // Smooth scroll untuk navigasi link
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Load data
  displayMenu(menuData);
  loadCartFromStorage();
  loadFavoritesFromStorage();
  updateCartDisplay();

  // Animasi menu card
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".menu-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s, transform 0.5s";
    observer.observe(card);
  });
});

// NavBar untuk efek scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = "#f32929";
      navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      navbar.style.backgroundColor = "#805608";
      navbar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
    }
  }
});

// Tutup keranjang jika klik di luar
document.addEventListener('click', function(e) {
  const cartSidebar = document.getElementById('cartSidebar');
  const cartToggle = document.querySelector('.cart-toggle');
  const overlay = document.querySelector('.cart-overlay');
  
  if (cartSidebar && cartSidebar.classList.contains('active')) {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
      cartSidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
  
  // Tutup modal jika klik overlay
  if (e.target.classList && e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// Fungsi checkout (overwrite yang lama)
window.checkout = function() {
  openCheckoutModal();
};
