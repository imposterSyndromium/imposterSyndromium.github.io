/**
 * Header Include and Site Message Handler
 * 
 * This script:
 * 1. Includes the header component in all pages
 * 2. Handles the site message banner functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Include header component
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Initialize site message
            initializeSiteMessage();
            
            // Initialize mobile menu
            initializeMobileMenu();
        })
        .catch(error => console.error('Error loading header:', error));
});

function initializeSiteMessage() {
    // Get the current script's path
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('header-include.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    // Calculate the correct path to the data directory
    let dataPath = '../data/site-message.txt';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        dataPath = '../'.repeat(depth) + 'data/site-message.txt';
    }
    
    // Fetch the message from the text file
    fetch(dataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load site message');
            }
            return response.text();
        })
        .then(text => {
            const trimmedText = text.trim();
            const messageContainer = document.getElementById('site-message');
            
            if (trimmedText) {
                messageContainer.textContent = trimmedText;
                messageContainer.style.display = 'block';
            } else {
                messageContainer.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error loading site message:', error);
            document.getElementById('site-message').style.display = 'none';
        });
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
} 