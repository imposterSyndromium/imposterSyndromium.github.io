/**
 * Blog Functionality JavaScript
 * 
 * Handles:
 * - Loading and displaying blog posts from JSON file
 * - Filtering posts by category
 * - Searching posts by title, tags, and content
 * - Rendering featured posts
 * - Handling post navigation
 * - URL routing for individual posts
 */

/**
 * Global state for blog posts and filters
 */
let allPosts = [];
let filteredPosts = [];
let currentCategory = 'all';
let currentSearchQuery = '';

/**
 * Initialize blog functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the blog listing page
    const blogContainer = document.getElementById('blog-posts-container');
    if (blogContainer) {
        initializeBlogListing();
    }
    
    // Check if we're on a blog post detail page
    const postContentContainer = document.getElementById('blog-post-content');
    if (postContentContainer) {
        initializeBlogPost();
    }
});

/**
 * Initialize blog listing page
 * Loads posts, sets up filters and search
 */
async function initializeBlogListing() {
    try {
        await loadBlogPosts();
        setupFilters();
        setupSearch();
        renderBlogPosts();
    } catch (error) {
        console.error('Error initializing blog:', error);
        displayError('Failed to load blog posts. Please try again later.');
    }
}

/**
 * Initialize blog post detail page
 * Loads and displays individual post content
 */
async function initializeBlogPost() {
    try {
        // Get post ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            displayError('Post not found.');
            return;
        }
        
        await loadBlogPosts();
        const post = allPosts.find(p => p.id === postId);
        
        if (!post) {
            displayError('Post not found.');
            return;
        }
        
        renderBlogPost(post);
    } catch (error) {
        console.error('Error loading blog post:', error);
        displayError('Failed to load blog post. Please try again later.');
    }
}

/**
 * Load blog posts from JSON file
 * Handles path calculation for different page depths
 */
async function loadBlogPosts() {
    // Calculate path to data file based on current page location
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('blog.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    let dataPath = '/data/blog-posts.json';
    if (scriptPath.includes('/pages/')) {
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        dataPath = '../'.repeat(depth) + 'data/blog-posts.json';
    }
    
    const response = await fetch(dataPath);
    if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }
    
    allPosts = await response.json();
    // Sort posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPosts = [...allPosts];
}

/**
 * Set up category filter buttons
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentCategory = this.dataset.category;
            filterPosts();
        });
    });
}

/**
 * Set up search input
 */
function setupSearch() {
    const searchInput = document.getElementById('blog-search-input');
    
    if (searchInput) {
        // Debounce search input
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearchQuery = this.value.toLowerCase().trim();
                filterPosts();
            }, 300);
        });
    }
}

/**
 * Filter posts based on category and search query
 */
function filterPosts() {
    filteredPosts = allPosts.filter(post => {
        // Category filter
        const categoryMatch = currentCategory === 'all' || post.category === currentCategory;
        
        // Search filter
        const searchMatch = !currentSearchQuery || 
            post.title.toLowerCase().includes(currentSearchQuery) ||
            post.excerpt.toLowerCase().includes(currentSearchQuery) ||
            post.content.toLowerCase().includes(currentSearchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(currentSearchQuery));
        
        return categoryMatch && searchMatch;
    });
    
    renderBlogPosts();
}

/**
 * Render blog posts to the page
 */
function renderBlogPosts() {
    const postsContainer = document.getElementById('blog-posts-container');
    const featuredContainer = document.getElementById('featured-post-container');
    const emptyState = document.getElementById('blog-empty-state');
    
    if (!postsContainer) return;
    
    // Clear containers
    postsContainer.innerHTML = '';
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
    }
    
    // Show empty state if no posts match
    if (filteredPosts.length === 0) {
        postsContainer.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // Hide empty state
    postsContainer.style.display = 'grid';
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Render featured post (if any)
    const featuredPost = filteredPosts.find(post => post.featured);
    if (featuredPost && featuredContainer) {
        featuredContainer.innerHTML = createFeaturedPostHTML(featuredPost);
        // Add click handler
        const featuredElement = featuredContainer.querySelector('.featured-post');
        if (featuredElement) {
            featuredElement.addEventListener('click', () => navigateToPost(featuredPost.id));
        }
    }
    
    // Filter out featured post from regular posts
    const regularPosts = filteredPosts.filter(post => !post.featured || !featuredContainer);
    
    // Render regular posts
    regularPosts.forEach(post => {
        const postCard = createPostCard(post);
        postsContainer.appendChild(postCard);
        
        // Add click handler
        postCard.addEventListener('click', () => navigateToPost(post.id));
    });
}

/**
 * Create HTML for featured post
 */
function createFeaturedPostHTML(post) {
    const date = formatDate(post.date);
    const tagsHTML = post.tags.map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('');
    
    return `
        <div class="featured-post">
            <div class="featured-post-content">
                <h2>${escapeHtml(post.title)}</h2>
                <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
                <div class="post-meta">
                    <span class="post-meta-item post-date">📅 ${date}</span>
                    <span class="post-meta-item post-category">${escapeHtml(post.category)}</span>
                    <span class="post-meta-item post-read-time">⏱️ ${post.readTime} min read</span>
                </div>
                ${tagsHTML ? `<div class="post-tags">${tagsHTML}</div>` : ''}
            </div>
        </div>
    `;
}

/**
 * Create HTML card for a blog post
 */
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-post-card';
    
    const date = formatDate(post.date);
    const tagsHTML = post.tags.map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('');
    
    card.innerHTML = `
        <h3>${escapeHtml(post.title)}</h3>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
        <div class="post-meta">
            <span class="post-meta-item post-date">📅 ${date}</span>
            <span class="post-meta-item post-category">${escapeHtml(post.category)}</span>
            <span class="post-meta-item post-read-time">⏱️ ${post.readTime} min read</span>
        </div>
        ${tagsHTML ? `<div class="post-tags">${tagsHTML}</div>` : ''}
    `;
    
    return card;
}

/**
 * Render individual blog post detail page
 */
function renderBlogPost(post) {
    // Update page title
    document.title = `${post.title} - Blog - Robin O'Brien`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = post.excerpt;
    }
    
    // Render header
    const header = document.getElementById('blog-post-header');
    if (header) {
        const date = formatDate(post.date);
        const tagsHTML = post.tags.map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('');
        
        header.innerHTML = `
            <h1>${escapeHtml(post.title)}</h1>
            <div class="blog-post-meta">
                <span class="post-meta-item post-date">📅 ${date}</span>
                <span class="post-meta-item post-category">${escapeHtml(post.category)}</span>
                <span class="post-meta-item post-read-time">⏱️ ${post.readTime} min read</span>
            </div>
            ${tagsHTML ? `<div class="post-tags" style="justify-content: center; margin-top: 1rem;">${tagsHTML}</div>` : ''}
        `;
    }
    
    // Render content
    const contentContainer = document.getElementById('blog-post-content');
    if (contentContainer) {
        // Convert markdown-like content to HTML
        const contentHTML = convertMarkdownToHTML(post.content);
        contentContainer.innerHTML = contentHTML;
    }
    
    // Render footer with back link
    const footer = document.getElementById('blog-post-footer');
    if (footer) {
        // Calculate path back to blog listing
        const scripts = document.getElementsByTagName('script');
        const currentScript = Array.from(scripts).find(script => script.src.includes('blog.js'));
        const scriptPath = currentScript ? currentScript.src : '';
        
        let blogPath = '/pages/blog.html';
        if (scriptPath.includes('/pages/')) {
            const depth = (scriptPath.match(/\/pages\//g) || []).length;
            blogPath = '../'.repeat(depth - 1) + 'blog.html';
        }
        
        footer.innerHTML = `
            <a href="${blogPath}" class="back-to-blog">← Back to Blog</a>
        `;
    }
}

/**
 * Convert simple markdown-like syntax to HTML
 * Handles headers, paragraphs, lists, and code blocks
 */
function convertMarkdownToHTML(text) {
    // First, extract inline code blocks and replace with placeholders
    const codePlaceholders = [];
    let codeIndex = 0;
    
    // Replace inline code with placeholders before processing
    let processedText = text.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `__INLINE_CODE_${codeIndex}__`;
        codePlaceholders[codeIndex] = code;
        codeIndex++;
        return placeholder;
    });
    
    // Split text into lines for processing
    const lines = processedText.split('\n');
    const output = [];
    let inList = false;
    let listType = null;
    let currentParagraph = [];
    
    function flushParagraph() {
        if (currentParagraph.length > 0) {
            const paraText = currentParagraph.join(' ').trim();
            if (paraText) {
                output.push(`<p>${escapeHtml(paraText)}</p>`);
            }
            currentParagraph = [];
        }
    }
    
    function flushList() {
        if (inList && output.length > 0) {
            const tag = listType === 'ul' ? 'ul' : 'ol';
            // Find last list items and wrap them
            let listItems = [];
            while (output.length > 0 && output[output.length - 1].startsWith('<li>')) {
                listItems.unshift(output.pop());
            }
            if (listItems.length > 0) {
                output.push(`<${tag}>${listItems.join('')}</${tag}>`);
            }
        }
        inList = false;
        listType = null;
    }
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Handle headers
        if (line.startsWith('### ')) {
            flushList();
            flushParagraph();
            output.push(`<h3>${escapeHtml(line.substring(4))}</h3>`);
            continue;
        }
        if (line.startsWith('## ')) {
            flushList();
            flushParagraph();
            output.push(`<h2>${escapeHtml(line.substring(3))}</h2>`);
            continue;
        }
        if (line.startsWith('# ')) {
            flushList();
            flushParagraph();
            output.push(`<h1>${escapeHtml(line.substring(2))}</h1>`);
            continue;
        }
        
        // Handle unordered lists
        if (line.startsWith('- ')) {
            if (inList && listType !== 'ul') {
                flushList();
            }
            flushParagraph();
            inList = true;
            listType = 'ul';
            output.push(`<li>${escapeHtml(line.substring(2))}</li>`);
            continue;
        }
        
        // Handle ordered lists
        const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (orderedMatch) {
            if (inList && listType !== 'ol') {
                flushList();
            }
            flushParagraph();
            inList = true;
            listType = 'ol';
            output.push(`<li>${escapeHtml(orderedMatch[2])}</li>`);
            continue;
        }
        
        // Handle empty lines
        if (line === '') {
            if (inList) {
                flushList();
            }
            flushParagraph();
            continue;
        }
        
        // Handle regular paragraph text
        if (inList) {
            flushList();
        }
        currentParagraph.push(line);
    }
    
    // Flush remaining content
    flushList();
    flushParagraph();
    
    let html = output.join('\n');
    
    // Restore inline code blocks (after HTML escaping)
    html = html.replace(/__INLINE_CODE_(\d+)__/g, (match, index) => {
        const code = codePlaceholders[parseInt(index)];
        return `<code>${escapeHtml(code)}</code>`;
    });
    
    // Wrap consecutive list items in list tags
    html = html.replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
        const items = match.match(/<li>.*?<\/li>/g);
        if (items && items.length > 0) {
            return `<ul>${items.join('')}</ul>`;
        }
        return match;
    });
    
    return html;
}

/**
 * Navigate to individual blog post
 */
function navigateToPost(postId) {
    // Calculate path to blog post page
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('blog.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    let postPath = '/pages/blog/post.html';
    if (scriptPath.includes('/pages/')) {
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        postPath = '../'.repeat(depth - 1) + 'blog/post.html';
    }
    
    window.location.href = `${postPath}?id=${encodeURIComponent(postId)}`;
}

/**
 * Format date string to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Display error message
 */
function displayError(message) {
    const container = document.getElementById('blog-posts-container') || 
                      document.getElementById('blog-post-content');
    if (container) {
        container.innerHTML = `
            <div class="blog-empty-state">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }
}

/**
 * Clear all filters
 */
function clearFilters() {
    currentCategory = 'all';
    currentSearchQuery = '';
    
    // Update UI
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    filterPosts();
}

// Make clearFilters available globally for onclick handler
window.clearFilters = clearFilters;

