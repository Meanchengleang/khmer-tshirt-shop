let products = JSON.parse(localStorage.getItem('products')) || [];

function renderAdminProducts(productsToRender = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productsToRender.map(product => {
        const stockStatus = product.stock === 0 ? 'out-stock' : 
                          product.stock <= 5 ? 'low-stock' : 'in-stock';
        const stockClass = `stock-indicator ${stockStatus}`;
        
        return `
            <div class="admin-product-card">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <p class="${stockClass}">
                        <i class="fas ${stockStatus === 'out-stock' ? 'fa-times-circle' : 
                                      stockStatus === 'low-stock' ? 'fa-exclamation-circle' : 
                                      'fa-check-circle'}"></i>
                        ${product.stock}
                    </p>
                </div>
                <div class="product-actions">
                    <button class="icon-btn edit-btn" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-btn" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function showModal(isEdit = false, product = null) {
    const modal = document.getElementById('edit-product-modal');
    const form = document.getElementById('product-form');
    
    if (product) {
        // Update preview information
        document.getElementById('preview-image').src = product.image;
        document.getElementById('preview-name').textContent = product.name;
        document.getElementById('preview-price').textContent = `$${product.price.toFixed(2)}`;
        form.elements['product-stock'].value = product.stock;
        form.dataset.editId = product.id;
        
        // Setup quantity buttons
        const minusBtn = form.querySelector('.minus');
        const plusBtn = form.querySelector('.plus');
        const qtyInput = form.elements['product-stock'];
        
        minusBtn.onclick = () => {
            if (qtyInput.value > 0) qtyInput.value = parseInt(qtyInput.value) - 1;
        };
        
        plusBtn.onclick = () => qtyInput.value = parseInt(qtyInput.value) + 1;
    }
    
    modal.style.display = 'block';
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        showModal(true, product);
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminProducts();
    }
}

// Event Listeners
document.getElementById('add-product-btn').addEventListener('click', () => {
    const modal = document.getElementById('add-product-modal');
    const form = document.getElementById('add-product-form');
    modal.style.display = 'block';
});

document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newStock = parseInt(form.elements['product-stock'].value);
    
    if (newStock < 0) {
        alert('Quantity cannot be negative');
        return;
    }
    
    if (form.dataset.editId) {
        const id = parseInt(form.dataset.editId);
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index].stock = newStock;
            localStorage.setItem('products', JSON.stringify(products));
            renderAdminProducts();
        }
    }
    
    document.getElementById('edit-product-modal').style.display = 'none';
});

document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const newProduct = {
        id: products.length + 1,
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        description: formData.get('description'),
        image: formData.get('image').name
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminProducts();
    
    form.reset();
    document.getElementById('add-product-modal').style.display = 'none';
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modalId = closeBtn.dataset.modal || closeBtn.closest('.modal').id;
        document.getElementById(modalId).style.display = 'none';
    });
});

// Search and Filter
document.getElementById('search-products').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm);
    });
    
    renderAdminProducts(filtered);
});

document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Hide all views
        document.querySelectorAll('.admin-view').forEach(view => view.style.display = 'none');
        // Show selected view
        document.getElementById(`${btn.dataset.view}-view`).style.display = 'block';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAdminProducts();
    checkNewOrders();
    initializeDashboard();
});

function updateStock(productId, newStock) {
    const product = products.find(p => p.id === productId);
    if (product && newStock >= 0) {
        product.stock = newStock;
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminProducts();
    }
}

function checkNewOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrders = orders.filter(order => order.status === 'new');
    
    if (newOrders.length > 0) {
        showNotification(`You have ${newOrders.length} new order(s)!`);
        updateOrdersView(orders);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove();">&times;</button>
    `;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => notification.remove(), 5000);
}

function updateOrdersView(orders) {
    const ordersView = document.getElementById('orders-view');
    if (!ordersView) return;

    ordersView.innerHTML = `
        <h2>Orders</h2>
        <div class="orders-grid">
            ${orders.map(order => `
                <div class="order-card ${order.status}">
                    <div class="order-header">
                        <h3>Order #${order.id}</h3>
                        <span class="order-date">${new Date(order.date).toLocaleString()}</span>
                    </div>
                    <div class="order-details">
                        <p>Items: ${order.items.length}</p>
                        <p>Total: $${order.total.toFixed(2)}</p>
                        <p>Status: ${order.status}</p>
                    </div>
                    <button onclick="updateOrderStatus(${order.id})" class="admin-btn">
                        Mark as Processed
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function updateOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'processed';
        localStorage.setItem('orders', JSON.stringify(orders));
        updateOrdersView(orders);
    }
}

// Check for new orders every 30 seconds
setInterval(checkNewOrders, 30000);

// Dashboard Functions
function initializeDashboard() {
    updateDashboardMetrics();
    initializeSalesChart();
    updateTopProducts();
    setInterval(updateDashboardMetrics, 60000); // Update every minute
}

function updateDashboardMetrics() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Filter orders for last 30 days
    const recentOrders = orders.filter(order => new Date(order.date) > last30Days);
    
    // Calculate metrics
    const totalSales = recentOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.status === 'new').length;
    const lowStockItems = products.filter(product => product.stock <= 5).length;

    // Update dashboard cards
    document.getElementById('total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('total-orders').textContent = recentOrders.length;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('low-stock-count').textContent = lowStockItems;
}

function initializeSalesChart() {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get last 7 days
    const labels = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString();
    }).reverse();

    // Calculate daily sales
    const salesData = labels.map(date => {
        return orders
            .filter(order => new Date(order.date).toLocaleDateString() === date)
            .reduce((sum, order) => sum + order.total, 0);
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Sales ($)',
                data: salesData,
                borderColor: '#4CAF50',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '$' + value
                    }
                }
            }
        }
    });
}

function updateTopProducts() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const productSales = {};

    // Calculate total sales for each product
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0
                };
            }
            productSales[item.id].quantity += item.quantity;
            productSales[item.id].revenue += item.price * item.quantity;
        });
    });

    // Sort products by revenue
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // Update top products display
    const topProductsContainer = document.getElementById('top-products');
    topProductsContainer.innerHTML = topProducts.map((product, index) => `
        <div class="top-product-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${product.name}</span>
            <span class="sales">$${product.revenue.toFixed(2)}</span>
            <span class="quantity">(${product.quantity} units)</span>
        </div>
    `).join('');
}