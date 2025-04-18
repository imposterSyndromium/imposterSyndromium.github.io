/**
 * Header Include and Site Message Handler
 * 
 * This script:
 * 1. Includes the header component in all pages
 * 2. Handles the site message banner functionality
 * 3. Initializes mobile menu functionality
 */

// Cache for storing fetched data
const cache = {
    header: null,
    message: null
};

document.addEventListener('DOMContentLoaded', function() {
    // Get the current script's path
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('header-include.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    // Calculate the correct path to the components directory
    let headerPath = '/components/header.html';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        headerPath = '../'.repeat(depth) + 'components/header.html';
    }
    
    // Include header component
    if (cache.header) {
        document.body.insertAdjacentHTML('afterbegin', cache.header);
        initializeSiteMessage();
        initializeMobileMenu();
    } else {
        fetch(headerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load header: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                cache.header = data;
                document.body.insertAdjacentHTML('afterbegin', data);
                initializeSiteMessage();
                initializeMobileMenu();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback header in case of error
                const fallbackHeader = `
                    <header>
                        <nav>
                            <div class="container">
                                <a href="/" class="logo">ImposterSyndromium</a>
                                <button class="mobile-menu-btn" aria-label="Toggle menu">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                                <ul class="nav-links">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/pages/highlights">Highlights</a></li>
                                    <li><a href="/pages/products">Products</a></li>
                                    <li><a href="/pages/support">Support</a></li>
                                </ul>
                            </div>
                        </nav>
                    </header>
                `;
                document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
                initializeMobileMenu();
            });
    }
});

function initializeSiteMessage() {
    if (cache.message !== null) {
        displaySiteMessage(cache.message);
        return;
    }

    // Get the current script's path
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('header-include.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    // Calculate the correct path to the data directory
    let dataPath = '/data/site-message.txt';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        dataPath = '../'.repeat(depth) + 'data/site-message.txt';
    }
    
    // Fetch the message from the text file
    fetch(dataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load site message: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(text => {
            const trimmedText = text.trim();
            cache.message = trimmedText;
            displaySiteMessage(trimmedText);
        })
        .catch(error => {
            console.error('Error loading site message:', error);
            displaySiteMessage('');
        });
}

function displaySiteMessage(text) {
    const messageContainer = document.getElementById('site-message');
    if (!messageContainer) return;

    if (text) {
        messageContainer.textContent = text;
        messageContainer.style.display = 'block';
        messageContainer.setAttribute('aria-live', 'polite');
    } else {
        messageContainer.style.display = 'none';
    }
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            }
        });
    }
} 