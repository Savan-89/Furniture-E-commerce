// Sample product data
const products = [
    {
        id: 1,
        name: "Modern Leather Sofa",
        price: 899.99,
        category: "Sofas",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Premium leather sofa with modern design. Perfect for your living room. Features high-quality materials and comfortable seating for 3 people."
    },
    {
        id: 2,
        name: "Wooden Dining Table",
        price: 599.99,
        category: "Tables",
        image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQkSJ8cj3XifQjfAefD8Km2QBhdChb2syLovfumk5xMRfhYCKGO711Hrm8G3A3dzyUrrxiFxm1NePCGwPCMbVFkW4psW88k5o4f-OqhSWY",
        description: "Solid oak dining table with extendable feature. Seats 6-8 people comfortably. Handcrafted with attention to detail."
    },
    {
        id: 3,
        name: "Ergonomic Office Chair",
        price: 249.99,
        category: "Chairs",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Adjustable ergonomic office chair with lumbar support. Perfect for long working hours. Features breathable mesh back and adjustable armrests."
    },
    {
        id: 4,
        name: "King Size Bed Frame",
        price: 799.99,
        category: "Beds",
        image: "https://images.meesho.com/images/products/139766685/4one7_1200.jpg",
        description: "Solid wood king size bed frame with upholstered headboard. Includes slats for mattress support. Elegant design that complements any bedroom."
    },
    {
        id: 5,
        name: "Coffee Table Set",
        price: 349.99,
        category: "Tables",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Modern coffee table set with glass top and metal frame. Includes two side tables. Sleek design perfect for contemporary living spaces."
    },
    {
        id: 6,
        name: "Accent Armchair",
        price: 299.99,
        category: "Chairs",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Stylish accent armchair with velvet upholstery. Features solid wood legs and comfortable cushioning. Perfect for reading nooks or living rooms."
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productModal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const modalProductDetails = document.getElementById('modal-product-details');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="view-details" data-id="${product.id}">View Details</button>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            showProductModal(productId);
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Show product modal
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    
    modalProductDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-product-img">
        <div class="modal-product-info">
            <h2 class="modal-product-title">${product.name}</h2>
            <p class="modal-product-price">$${product.price.toFixed(2)}</p>
            <p class="modal-product-description">${product.description}</p>
            <div class="modal-product-actions">
                <button class="btn add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
                <button class="btn view-details-modal" style="background-color: #eee; color: #333;">Close</button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'block';
    
    // Add event listeners to modal buttons
    document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        addToCart(productId);
        productModal.style.display = 'none';
    });
    
    document.querySelector('.view-details-modal').addEventListener('click', () => {
        productModal.style.display = 'none';
    });
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Update cart UI
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                updateCartItemQuantity(itemId, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                updateCartItemQuantity(itemId, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                removeCartItem(itemId);
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
    }
}

// Remove cart item
function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Show cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Event listeners
cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Initialize the page
displayProducts();
updateCart();

// Add cart notification styles
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 3000;
    }
    
    .cart-notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);