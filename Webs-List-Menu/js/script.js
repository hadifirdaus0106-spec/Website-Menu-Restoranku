// Data menu
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
        <div class="menu-card">
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
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
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
function addToCart(itemId) {
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
  }
}

// Fungsi untuk menambah quantity
function increaseQuantity(itemId) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += 1;
    updateCartDisplay();
    saveCartToStorage();
  }
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(itemId) {
  const item = cart.find(item => item.id === itemId);
  cart = cart.filter(item => item.id !== itemId);
  updateCartDisplay();
  showNotification(`${item.name} dihapus dari keranjang!`, 'info');
  saveCartToStorage();
}

// Fungsi untuk mengosongkan keranjang
function clearCart() {
  if (cart.length === 0) {
    showNotification('Keranjang sudah kosong!', 'info');
    return;
  }
  
  if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
    cart = [];
    updateCartDisplay();
    showNotification('Keranjang telah dikosongkan!', 'info');
    saveCartToStorage();
  }
}

// Fungsi untuk update tampilan keranjang
function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.getElementById('cartTotal');
  
  // Update jumlah item di toggle
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  
  // Hitung total harga
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartTotal) cartTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
  
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

// Fungsi untuk checkout
function checkout() {
  if (cart.length === 0) {
    showNotification('Keranjang masih kosong!', 'info');
    return;
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Buat ringkasan pesanan
  let orderSummary = "🍽️ *PESANAN SAYA*\n\n";
  cart.forEach(item => {
    orderSummary += `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
  });
  orderSummary += `\n📦 *Total Item:* ${totalItems}`;
  orderSummary += `\n💰 *Total Harga:* Rp ${totalPrice.toLocaleString('id-ID')}`;
  
  // Encode pesan untuk URL
  const encodedMessage = encodeURIComponent(orderSummary);
  
  // Nomor WhatsApp (ganti dengan nomor tujuan)
  const phoneNumber = "6281990101270"; // Gunakan format internasional tanpa +
  
  // Buat URL WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Tampilkan konfirmasi
  if (confirm(`🛒 TOTAL PESANAN:\n\n${orderSummary.replace(/[*]/g, '')}\n\nLanjutkan ke WhatsApp?`)) {
    window.open(whatsappUrl, '_blank');
    showNotification('Mengalihkan ke WhatsApp...', 'success');
  }
}

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

  // Initialize menu
  displayMenu(menuData);
  loadCartFromStorage();

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
});