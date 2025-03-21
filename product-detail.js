document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === parseInt(productId));
    
    if (product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('main-image').src = product.image;
        document.title = `${product.name} - T-Shirt Shop`;
        
        // Add product type
        document.querySelector('.product-info').insertAdjacentHTML('afterbegin', `
            <div class="product-type-badge">
                <i class="fas fa-tag"></i> ${product.type}
            </div>
        `);
        
        // Create array of all images for this product
        const productImages = [
            product.image,
            product.image.replace('.jpg', '-back.jpg'),
            product.image.replace('.jpg', '-detail.jpg')
        ];
        
        let currentImageIndex = 0;
        
        // Populate thumbnails
        const thumbnailsContainer = document.getElementById('image-thumbnails');
        thumbnailsContainer.innerHTML = productImages.map((img, index) => `
            <img src="${img}" alt="${product.name}" 
                class="thumbnail ${index === 0 ? 'active' : ''}"
                onclick="changeMainImage(${index})">
        `).join('');
        
        // Gallery navigation
        document.querySelector('.prev').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
            updateMainImage();
        });
        
        document.querySelector('.next').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % productImages.length;
            updateMainImage();
        });
        
        function updateMainImage() {
            document.getElementById('main-image').src = productImages[currentImageIndex];
            document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentImageIndex);
            });
        }
        
        window.changeMainImage = (index) => {
            currentImageIndex = index;
            updateMainImage();
        };
        
        // Handle size selection
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
        
        // Color selection
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                colorButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('color-name').textContent = 
                    btn.dataset.color.charAt(0).toUpperCase() + btn.dataset.color.slice(1);
            });
        });
        
        // Handle add to cart
        document.getElementById('add-to-cart').addEventListener('click', () => {
            const selectedSize = document.querySelector('.size-btn.selected');
            const selectedColor = document.querySelector('.color-btn.selected');
            
            if (!selectedSize || !selectedColor) {
                alert('Please select both size and color');
                return;
            }
            
            // Update cart count
            const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
            localStorage.setItem('cartCount', cartCount);
            document.getElementById('cart-count').textContent = cartCount;
            
            alert(`${product.name} (Size: ${selectedSize.dataset.size}, Color: ${selectedColor.dataset.color}) added to cart!`);
        });
        
        // Add stock status
        const addToCartBtn = document.getElementById('add-to-cart');
        if (product.stock === 0) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Out of Stock';
        } else {
            addToCartBtn.insertAdjacentHTML('beforebegin', `
                <div class="stock-status">
                    <i class="fas fa-check-circle"></i> In Stock: ${product.stock} units
                </div>
            `);
        }
    }
});
