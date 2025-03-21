const fs = require('fs');

// Function to load all images from directory
function loadLocalImages() {
    const imgDir = './img';
    
    try {
        // Read all files from img directory
        const files = fs.readdirSync(imgDir)
            .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
        
        // Create products from images
        const products = files.map((file, index) => ({
            id: index + 1,
            name: file.split('.')[0]
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            price: 29.99 + (Math.random() * 10).toFixed(2), // Random price between 29.99 and 39.99
            image: `img/${file}`,
            category: getCategoryFromFilename(file),
            stock: Math.floor(Math.random() * 20) + 5, // Random stock between 5 and 25
            description: `Beautiful ${file.split('.')[0].replace(/-/g, ' ')} design t-shirt`
        }));

        return products;
    } catch (error) {
        console.error('Error loading images:', error);
        return [];
    }
}

// Helper function to determine category from filename
function getCategoryFromFilename(filename) {
    if (filename.includes('black')) return 'streetwear';
    if (filename.includes('khmer') || filename.includes('angkor')) return 'artistic';
    return 'graphic';
}

// Initialize products
let products = [];

// Function to handle image errors with retry
function handleImageError(img) {
    const retryCount = parseInt(img.dataset.retryCount || 0);
    if (retryCount < 3) { // Try 3 times
        img.dataset.retryCount = retryCount + 1;
        setTimeout(() => {
            img.src = img.src; // Retry loading
        }, 1000); // Wait 1 second before retry
    } else {
        img.onerror = null; // Stop retrying
        img.src = 'https://via.placeholder.com/800x800.jpg?text=Product+Image';
    }
}

// Function to display products
function displayProducts(productsToShow = products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = `
            <div class="product-card">
                <span class="product-type">${product.category}</span>
                <span class="product-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                    ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
                <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this)">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <div class="product-actions">
                    <button class="view-details-btn" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="add-cart-btn" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        productGrid.innerHTML += productCard;
    });
}

// Initialize the page with dynamic image loading
document.addEventListener('DOMContentLoaded', () => {
    // Load all products from images
    products = loadLocalImages();
    
    // Display products
    displayProducts();
    
    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Category filter
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterProducts(category);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchProducts(searchTerm);
    });

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', () => {
        sortProducts(sortSelect.value);
    });
}

// Filter products by category
function filterProducts(category) {
    const filtered = category === 'all' ? 
        products : 
        products.filter(product => product.category === category);
    displayProducts(filtered);
}

// Search products
function searchProducts(searchTerm) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}

// Sort products
function sortProducts(sortBy) {
    let sorted = [...products];
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    displayProducts(sorted);
}
