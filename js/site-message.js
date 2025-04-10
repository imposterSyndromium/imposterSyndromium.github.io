/**
 * Site Message Handler
 * 
 * This script manages the display of site-wide messages.
 * It reads the message from data/site-message.txt and displays it
 * at the top of all pages if a message exists.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site message script loaded');
    
    // Create the message container
    const messageContainer = document.createElement('div');
    messageContainer.id = 'site-message';
    messageContainer.className = 'site-message';
    
    // Add the message container to the top of the body
    document.body.insertBefore(messageContainer, document.body.firstChild);
    
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    messageContainer.setAttribute('data-theme', currentTheme);
    
    // Get the current script's path
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => script.src.includes('site-message.js'));
    const scriptPath = currentScript ? currentScript.src : '';
    
    // Calculate the correct path to the data directory
    let dataPath = 'data/site-message.txt';
    if (scriptPath.includes('/pages/')) {
        // If we're in a subdirectory, adjust the path
        const depth = (scriptPath.match(/\/pages\//g) || []).length;
        dataPath = '../'.repeat(depth) + 'data/site-message.txt';
    }
    
    console.log('Fetching message from:', dataPath);
    
    // Fetch the message from the text file
    fetch(dataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load site message');
            }
            return response.text();
        })
        .then(text => {
            // Trim the text to remove any whitespace
            const trimmedText = text.trim();
            
            // Only display the message if there's actual content
            if (trimmedText) {
                messageContainer.textContent = trimmedText;
                messageContainer.style.display = 'block';
                console.log('Message displayed:', trimmedText);
            } else {
                messageContainer.style.display = 'none';
                console.log('No message to display');
            }
        })
        .catch(error => {
            console.error('Error loading site message:', error);
            messageContainer.style.display = 'none';
        });
}); 