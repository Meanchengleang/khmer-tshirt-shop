const imageNames = [
    'Angel Falling 1 Mockup.jpg',
    'Angel Falling 2 Mockup.jpg',
    'Apsara-1.png',
    'Break The Rules Mockup (5).jpg',
    'Cupid Sniper Streetwear 1 Mockup.jpg',
    'Dreams Cloth Mockup (3).jpg',
    'Fullmoon 1 Mockup (2).jpg',
    'INTROVERT 4 Mockup.jpg',
    'Rebel Cloth Mockup (2).jpg',
    'the Future project Mockup (2).jpg'
];

function formatProductName(filename) {
    // Remove file extension, numbers in parentheses, and 'Mockup' text
    return filename
        .replace(/\.(jpg|png)$/, '')                 // Remove file extension
        .replace(/Mockup.*$/, '')                    // Remove 'Mockup' and anything after
        .replace(/\(\d+\)/, '')                      // Remove numbers in parentheses
        .replace(/%20/g, ' ')                        // Replace %20 with spaces
        .replace(/([A-Z])/g, ' $1')                  // Add space before capital letters
        .replace(/\s+/g, ' ')                        // Replace multiple spaces with single space
        .replace(/^\d+\s*/, '')                      // Remove leading numbers
        .replace(/\s+$/, '')                         // Remove trailing spaces
        .split(' ')                                  // Split into words
        .filter(word => word.length > 0)             // Remove empty words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        .join(' ');                                  // Join back with spaces
}

function generateProducts() {
    return imageNames.map((imageName, index) => {
        const name = formatProductName(imageName);
        const categories = [];
        if (name.includes('Street') || name.includes('Future')) categories.push('streetwear');
        if (name.includes('Angel') || name.includes('Apsara')) categories.push('artistic');
        if (name.includes('Rules') || name.includes('INTROVERT')) categories.push('graphic');
        
        const stock = {
            quantity: Math.floor(Math.random() * 50),
            lowStockThreshold: 5,
            status: function() {
                if (this.quantity === 0) return 'out-stock';
                if (this.quantity <= this.lowStockThreshold) return 'low-stock';
                return 'in-stock';
            }
        };
        
        return {
            id: index + 1,
            name: name,
            price: 24.99 + (Math.random() * 5).toFixed(2) * 1,
            image: `img/${imageName}`,
            categories: categories.length ? categories : ['graphic'],
            stock: stock.quantity,
            stockStatus: stock.status(),
            type: categories[0] || 'graphic', // Primary category as type
            sizes: ['S', 'M', 'L', 'XL'],
            description: 'Premium quality T-shirt made from 100% cotton. Features a unique design that combines style and comfort. Perfect for casual wear or special occasions.',
            rating: 4.2,
            reviews: 28,
            features: [
                '100% Premium Cotton',
                'Pre-shrunk fabric',
                'Screen printed design',
                'Machine washable'
            ]
        };
    });
}

const products = generateProducts();
let cartCount = 0;
const cartCountElement = document.getElementById('cart-count');
let currentCategory = 'all';

function sortProducts(products, sortType) {
    switch(sortType) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'name':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        default:
            return products;
    }
}

function filterProducts(category) {
    currentPage = 1;
    currentCategory = category;
    
    let filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.categories.includes(category));

    // Apply sort
    const sortValue = document.getElementById('sort-select').value;
    filteredProducts = sortProducts(filteredProducts, sortValue);

    // Apply search if exists
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }

    renderProducts(filteredProducts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const PRODUCTS_PER_PAGE = 20;

let currentPage = 1;

// Modify the renderProducts function
function renderProducts(productsToRender = products) {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const paginatedProducts = productsToRender.slice(start, end);
    
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = paginatedProducts.map(product => {
        const stockStatus = product.stock === 0 ? 'out-stock' : 
                          product.stock <= 5 ? 'low-stock' : 'in-stock';
        const stockMessage = stockStatus === 'out-stock' ? 'Out of Stock' :
                           stockStatus === 'low-stock' ? `Only ${product.stock} left` :
                           'In Stock';
        
        return `
            <div class="product-card fade-in">
                <div class="product-badge ${stockStatus}">
                    ${stockMessage}
                </div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="view-details-btn" onclick="location.href='product-detail.html?id=${product.id}'">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="add-cart-btn" onclick="addToCart(${product.id})" 
                        ${stockStatus === 'out-stock' ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> ${stockStatus === 'out-stock' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    renderPagination(productsToRender.length);
    localStorage.setItem('products', JSON.stringify(products));
}

function renderPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = `
        <button onclick="changePage('prev')" class="page-btn" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" 
                    class="page-btn ${currentPage === i ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    paginationHTML += `
        <button onclick="changePage('next')" class="page-btn" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    
    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(totalPages, currentPage + 1);
    } else {
        currentPage = page;
    }
    
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addToCart(productId, size = '', color = 'white') {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    
    // Add animation effect
    cartCountElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 200);
}

// Update cart icon click handler
document.querySelector('.cart-icon').addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Function to scan the img directory and generate products
async function scanImageDirectory() {
    try {
        // Clear existing products
        products.length = 0;
        
        // Get all image files from the img folder
        const response = await fetch('img/');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        // Filter for image files
        const imageFiles = links
            .map(link => link.href)
            .filter(href => href.match(/\.(jpg|jpeg|png|gif)$/i))
            .map(href => href.split('/').pop());

        // Generate products from found images
        imageFiles.forEach((imageName, index) => {
            products.push({
                id: index + 1,
                name: formatProductName(imageName),
                price: 24.99 + (Math.random() * 5).toFixed(2) * 1,
                image: `img/${imageName}`
            });
        });

        // Render the products
        renderProducts();
    } catch (error) {
        console.error('Error scanning image directory:', error);
    }
}

// Initialize products when page loads
window.addEventListener('DOMContentLoaded', () => {
    scanImageDirectory();
    
    // Set up category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterProducts(btn.dataset.category);
        });
    });
    
    // Add search and sort listeners
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    
    searchInput.addEventListener('input', () => {
        currentPage = 1; // Reset page when searching
        filterProducts(currentCategory);
    });
    
    sortSelect.addEventListener('change', () => {
        filterProducts(currentCategory);
    });
    
    // Initial render
    filterProducts('all');
});

// Function to add new products dynamically
function addNewProduct(imageName) {
    const newId = products.length + 1;
    const newProduct = {
        id: newId,
        name: formatProductName(imageName),
        price: 24.99 + (Math.random() * 5).toFixed(2) * 1,
        image: `img/${imageName}`
    };
    products.push(newProduct);
    renderProducts();
}

// Example usage:
// addNewProduct('new-tshirt-design.jpg');

// Add these new functions
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    
    const modalAddBtn = document.getElementById('modal-add-cart');
    modalAddBtn.onclick = () => {
        const selectedSize = document.querySelector('.size-btn.selected');
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product.id, selectedSize.dataset.size);
        modal.style.display = 'none';
    };
    
    modal.style.display = 'block';
}

// Add size selection functionality
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

// Close modal when clicking the X or outside
document.querySelector('.close').onclick = () => {
    document.getElementById('product-modal').style.display = 'none';
};

window.onclick = (event) => {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Debounce search function for smoother performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const searchAndFilterProducts = debounce(() => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;
    
    let filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.categories.includes(currentCategory));
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    renderProducts(filteredProducts);
}, 300);

// Update initialization
window.addEventListener('DOMContentLoaded', () => {
    scanImageDirectory();
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });
    
    // Add search and sort listeners
    document.getElementById('search-input').addEventListener('input', searchAndFilterProducts);
    document.getElementById('sort-select').addEventListener('change', searchAndFilterProducts);
});

// Newsletter subscription
document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    try {
        const response = await fetch('newsletter.php', {
            method: 'POST',
            body: new FormData(e.target)
        });
        const data = await response.json();
        
        alert(data.message);
        if (data.success) {
            e.target.reset();
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert('Something went wrong. Please try again later.');
    }
});
