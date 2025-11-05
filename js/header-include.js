/**
 * Header Include and Site Message Handler
 * 
 * This script dynamically loads and inserts the header component into all pages.
 * It also handles the site message banner functionality and mobile menu initialization.
 * 
 * Features:
 * - Dynamic path calculation for header.html based on current page depth
 * - Caching mechanism to reduce redundant HTTP requests
 * - Site message loading from data/site-message.txt
 * - Mobile menu toggle functionality
 * - Graceful error handling with fallback header
 * 
 * Note: Mobile menu initialization is duplicated in script.js
 * TODO: Consider extracting mobile menu logic to a shared module
 */

/**
 * Cache object for storing fetched data
 * Reduces HTTP requests by storing header HTML and site message text
 * @type {{header: string|null, message: string|null}}
 */
const cache = {
    header: null,
    message: null
};

/**
 * Initialize header inclusion on DOM content loaded
 * Calculates the correct path to header.html based on current page location
 * and loads the header component into the page
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Get the current script's path to determine page depth
     * @type {string}
     */
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('header-include.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    /**
     * Calculate the correct path to the components directory
     * Handles both root-level pages and nested subdirectory pages
     * @type {string}
     */
    let headerPath = '/components/header.html';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path relative to root
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        headerPath = '../'.repeat(depth) + 'components/header.html';
    }
    // Cache-busting with version number (better for browser caching)
    // Increment this version number when header.html changes
    headerPath += '?v=1.0.1';
    
    /**
     * Include header component
     * Uses cached version if available, otherwise fetches from server
     */
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
                                <a href="/" class="logo">Robin O'Brien</a>
                                <button class="mobile-menu-btn" aria-label="Toggle menu">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                                <ul class="nav-links">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/#about">About</a></li>
                                    <li><a href="/#projects">Projects</a></li>
                                    <li><a href="/#contact">Contact</a></li>
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

/**
 * Initialize Site Message Banner
 * Loads site message from data/site-message.txt and displays it in the banner
 * Uses caching to avoid redundant HTTP requests
 */
function initializeSiteMessage() {
    if (cache.message !== null) {
        displaySiteMessage(cache.message);
        return;
    }

    /**
     * Get the current script's path to determine page depth
     * @type {string}
     */
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('header-include.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    /**
     * Calculate the correct path to the data directory
     * Handles both root-level pages and nested subdirectory pages
     * @type {string}
     */
    let dataPath = '/data/site-message.txt';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path relative to root
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        dataPath = '../'.repeat(depth) + 'data/site-message.txt';
    }
    
    /**
     * Fetch the message from the text file
     * Displays message if content exists, otherwise hides the banner
     * If file doesn't exist or is empty, banner remains hidden
     */
    fetch(dataPath)
        .then(response => {
            // If file doesn't exist or fails to load, hide banner
            if (!response.ok) {
                displaySiteMessage('');
                return null;
            }
            return response.text();
        })
        .then(text => {
            if (text === null) {
                // Error case already handled
                return;
            }
            const trimmedText = text.trim();
            cache.message = trimmedText;
            // Only display if there's actual content
            displaySiteMessage(trimmedText || '');
        })
        .catch(error => {
            // Silently fail - hide banner if file doesn't exist or any other error
            displaySiteMessage('');
        });
}

/**
 * Display Site Message in Banner
 * Updates the site message banner element with the provided text
 * Adds a construction icon before the message text
 * @param {string} text - The message text to display (empty string hides banner)
 */
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

/**
 * Initialize Mobile Menu Functionality
 * Sets up event listeners for the mobile menu toggle button and handles:
 * - Mobile menu open/close
 * - Dropdown menu toggling on mobile
 * - Click outside to close
 * - Escape key to close
 * - Accessibility attributes
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    if (!mobileMenuBtn || !navLinks) return;

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        const isExpanded = navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    });

    // Handle dropdowns on mobile
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const isExpanded = item.classList.toggle('active');
                    link.setAttribute('aria-expanded', isExpanded);
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link) link.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link) link.setAttribute('aria-expanded', 'false');
            });
        }
    });
} 