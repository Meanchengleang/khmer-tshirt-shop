document.addEventListener('DOMContentLoaded', async () => {
    // Load cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Load header
    try {
        const response = await fetch('header.html');
        const html = await response.text();
        document.body.insertAdjacentHTML('afterbegin', html);
        
        // Update cart count
        document.getElementById('cart-count').textContent = cartCount;
        
        // Add cart click handler
        document.querySelector('.cart-icon').addEventListener('click', () => {
            window.location.href = '../cart.html';
        });
    } catch (error) {
        console.error('Error loading header:', error);
    }

    // Load footer from index.html and modify paths
    const footerHtml = `
        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About Us</h3>
                    <p>We create premium quality t-shirts with unique, original designs.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="shipping.html"><i class="fas fa-truck"></i> Shipping Information</a></li>
                        <li><a href="returns.html"><i class="fas fa-exchange-alt"></i> Returns & Exchange</a></li>
                        <li><a href="size-guide.html"><i class="fas fa-tshirt"></i> Size Guide</a></li>
                        <li><a href="contact.html"><i class="fas fa-phone"></i> Contact Us</a></li>
                        <li><a href="faq.html"><i class="fas fa-question-circle"></i> FAQ</a></li>
                        <li><a href="privacy-policy.html"><i class="fas fa-shield-alt"></i> Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Newsletter</h3>
                    <p>Subscribe for updates and exclusive offers!</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Your email">
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 T-Shirt Shop. All rights reserved.</p>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHtml);

    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
});
