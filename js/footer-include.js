/**
 * Footer Include Handler
 * 
 * This script dynamically loads and inserts the footer component into all pages.
 * It calculates the correct relative paths for links and images based on page depth.
 * 
 * Features:
 * - Dynamic path calculation for footer.html based on current page depth
 * - Automatic link path resolution for footer navigation links
 * - Image path resolution for platform logos
 * - Caching mechanism to reduce redundant HTTP requests
 * - Graceful error handling with fallback footer
 */

/**
 * Cache object for storing fetched footer HTML
 * Reduces HTTP requests by storing footer HTML
 * @type {string|null}
 */
const footerCache = {
    html: null
};

/**
 * Initialize footer inclusion on DOM content loaded
 * Calculates the correct path to footer.html based on current page location
 * and loads the footer component into the page
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Get the current script's path to determine page depth
     * @type {string}
     */
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('footer-include.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    /**
     * Calculate the correct path to the components directory
     * Handles both root-level pages and nested subdirectory pages
     * @type {string}
     */
    let footerPath = '/components/footer.html';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path relative to root
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        footerPath = '../'.repeat(depth) + 'components/footer.html';
    }
    // Cache-busting with version number
    footerPath += '?v=1.0.1';
    
    /**
     * Calculate the base path for relative links and images
     * @type {string}
     */
    const basePath = scriptPath.includes('/pages/') 
        ? '../'.repeat((scriptPath.match(/\/pages\//g) || []).length)
        : '';
    
    /**
     * Include footer component
     * Uses cached version if available, otherwise fetches from server
     */
    if (footerCache.html) {
        insertFooter(footerCache.html, basePath);
    } else {
        fetch(footerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load footer: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                footerCache.html = data;
                insertFooter(data, basePath);
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback footer in case of error
                const fallbackFooter = `
                    <footer>
                        <div class="container">
                            <div class="footer-content">
                                <div class="footer-section">
                                    <h3>About</h3>
                                    <p>IT Specialist & Application Developer with 13+ years of experience.</p>
                                </div>
                                <div class="footer-section">
                                    <h3>Quick Links</h3>
                                    <ul>
                                        <li><a href="${basePath}index.html#about">About</a></li>
                                        <li><a href="${basePath}index.html#projects">Projects</a></li>
                                        <li><a href="${basePath}index.html#contact">Contact</a></li>
                                    </ul>
                                </div>
                                <div class="footer-section">
                                    <h3>Connect</h3>
                                    <div class="social-links">
                                        <a href="https://github.com/imposterSyndromium/" target="_blank" rel="noopener noreferrer">GitHub</a>
                                        <a href="mailto:robin@robinobrien.me">Email</a>
                                    </div>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2025 Robin O'Brien. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                `;
                document.body.insertAdjacentHTML('beforeend', fallbackFooter);
            });
    }
});

/**
 * Insert footer into page and resolve all relative paths
 * @param {string} footerHtml - The footer HTML content
 * @param {string} basePath - The base path for relative links
 */
function insertFooter(footerHtml, basePath) {
    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = footerHtml;
    const footer = tempDiv.querySelector('footer');
    
    if (!footer) {
        console.error('Footer element not found in footer.html');
        return;
    }
    
    /**
     * Resolve footer navigation links based on page depth
     */
    const linkMap = {
        'about': basePath ? `${basePath}index.html#about` : '#about',
        'featured-projects': `${basePath}pages/highlights/featured-projects.html`,
        'awards': `${basePath}pages/highlights/awards.html`,
        'resume': basePath ? `${basePath}index.html#resume` : '#resume',
        'contact': basePath ? `${basePath}index.html#contact` : '#contact'
    };
    
    // Update all footer links
    footer.querySelectorAll('[data-footer-link]').forEach(link => {
        const linkType = link.getAttribute('data-footer-link');
        if (linkMap[linkType]) {
            link.href = linkMap[linkType];
            link.removeAttribute('data-footer-link');
        }
    });
    
    /**
     * Resolve image paths for platform logos
     */
    const imageMap = {
        'tux': `${basePath}images/tux.png?v=1.1.3`,
        'android': `${basePath}images/android.png?v=1.1.3`,
        'logo': `${basePath}images/logo.png?v=1.1.3`
    };
    
    // Update all footer images
    footer.querySelectorAll('[data-footer-image]').forEach(img => {
        const imageType = img.getAttribute('data-footer-image');
        if (imageMap[imageType]) {
            img.src = imageMap[imageType];
            img.removeAttribute('data-footer-image');
        }
    });
    
    // Insert footer before closing body tag
    document.body.insertAdjacentHTML('beforeend', footer.outerHTML);
}

