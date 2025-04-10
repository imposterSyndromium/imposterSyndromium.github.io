# User Flow & Project Structure

## User Journey

### Homepage Experience
1. User lands on homepage
2. Sees main navigation with dropdown menus
3. Can switch between light/dark themes
4. Interacts with clickable panels
5. Navigates to specific sections

### Product Exploration
1. User clicks on Products in navigation
2. Selects specific product category:
   - Software Solutions
   - Hardware Products
   - Professional Services
3. Views detailed product information
4. Can navigate between related products
5. Returns to homepage via navigation

### Content Navigation
1. User can access:
   - Highlights section
   - Product pages
   - Support resources
   - Updates and news
2. Each section maintains consistent navigation
3. Breadcrumb navigation for deeper pages
4. Easy return to homepage

## Data Flow

### Theme Management
1. User selects theme preference
2. Preference stored in localStorage
3. Theme applied across all pages
4. Persists between sessions

### Navigation State
1. Current page tracked in navigation
2. Dropdown menus maintain state
3. Mobile navigation collapses appropriately
4. Keyboard navigation state maintained

### Content Loading
1. Static content loaded immediately
2. Dynamic content loaded as needed
3. Loading states shown during transitions
4. Error states handled gracefully

## Project Structure

### Directory Organization
```
/
├── index.html              # Main homepage
├── css/                    # Stylesheets
│   ├── styles.css          # Main styles
│   └── themes.css          # Theme-specific styles
├── js/                     # JavaScript files
│   ├── main.js             # Main functionality
│   └── theme-switcher.js   # Theme switching logic
├── images/                 # Image assets
├── pages/                  # Individual pages
│   ├── products/           # Product-related pages
│   └── highlights/         # Highlight pages
└── project-docs/           # Project documentation
```

### File Responsibilities

#### HTML Files
- `index.html`: Main entry point
- `pages/products/*.html`: Product-specific pages
- `pages/highlights/*.html`: Highlight content pages

#### CSS Files
- `styles.css`: Core styling and layout
- `themes.css`: Theme-specific variables and overrides

#### JavaScript Files
- `main.js`: Core functionality and event handling
- `theme-switcher.js`: Theme management and persistence

## Component Structure

### Navigation
- Main navigation bar
- Dropdown menus
- Mobile navigation
- Breadcrumb navigation

### Content Sections
- Hero section
- Product cards
- Feature highlights
- Support resources
- Updates section

### UI Components
- Buttons
- Cards
- Panels
- Forms
- Modals
- Loading indicators

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## State Management
- Theme preference
- Navigation state
- Mobile menu state
- Content loading state
- Error states 