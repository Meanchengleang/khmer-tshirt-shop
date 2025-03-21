// Sample product data
const products = [
    {
        id: 1,
        name: "Classic Black T-Shirt",
        price: 29.99,
        image: "images/black-tshirt.jpg",
        category: "streetwear",
        stock: 15,
        description: "Classic comfortable black t-shirt"
    },
    {
        id: 2,
        name: "Khmer Pattern T-Shirt",
        price: 34.99,
        image: "images/khmer-pattern.jpg",
        category: "artistic",
        stock: 10,
        description: "Traditional Khmer pattern design"
    },
    // Add more products here
];

// Function to display products
function displayProducts(productsToShow = products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = `
            <div class="product-card">
                <span class="product-type">${product.category}</span>
                <span class="product-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                    ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
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
