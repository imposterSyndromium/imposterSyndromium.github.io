# Robin O'Brien - Personal Portfolio Website

A modern, responsive portfolio website showcasing professional experience, projects, and blog articles. Built with pure HTML, CSS, and JavaScript for optimal performance and accessibility.

## 🌟 Overview

This is a personal portfolio website that highlights:
- **Professional Experience**: 13+ years as IT Specialist & Application Developer at Toyota Boshoku
- **Technical Skills**: VB.NET, Swift/SwiftUI, SQL Server, PLC Integration, and more
- **Featured Projects**: Custom business applications, KPI dashboards, automated reporting systems
- **Blog & Articles**: Technology insights, development experiences, and career reflections

## ✨ Key Features

- **Modern Dark Theme**: Beautiful dark design with purple accent colors
- **Fully Responsive**: Mobile-first design that works on all devices
- **Blog System**: Complete blogging feature with filtering, search, and markdown support
- **Dynamic Content**: Header component loaded dynamically, site message banner
- **Smooth Animations**: Elegant transitions and scroll-based animations
- **Accessibility**: WCAG compliant with semantic HTML and ARIA labels
- **Performance Optimized**: Fast loading with efficient code structure

## 📁 Project Structure

```
imposterSyndromium.github.io/
├── index.html              # Main landing page
├── components/
│   └── header.html        # Reusable header component
├── pages/
│   ├── blog.html          # Blog listing page
│   ├── blog/
│   │   └── post.html      # Individual blog post template
│   ├── highlights/
│   │   ├── awards.html
│   │   ├── featured-projects.html
│   │   └── success-stories.html
│   ├── products/
│   │   ├── hardware-products.html      # PLC Integration & Automation
│   │   ├── professional-services.html
│   │   └── software-solutions.html      # Automated Reporting & Analytics
│   ├── resume.html
│   └── under-construction.html
├── css/
│   └── styles.css         # Main stylesheet with blog styles
├── js/
│   ├── blog.js           # Blog functionality
│   ├── header-include.js # Dynamic header loading
│   └── script.js         # Main site JavaScript
├── data/
│   ├── blog-posts.json   # Blog posts data
│   └── site-message.txt # Site-wide message banner content
├── images/
│   ├── logo.png
│   └── robin.png
├── resume/
│   └── RobinOBrien_Resume_20250729.pdf
├── project-docs/         # Project documentation
│   ├── overview.md
│   ├── requirements.md
│   ├── tech-specs.md
│   ├── timeline.md
│   ├── user-structure.md
│   └── products.md
└── README.md
```

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imposterSyndromium/imposterSyndromium.github.io.git
   cd imposterSyndromium.github.io
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Python
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     
     # PHP
     php -S localhost:8000
     ```

3. **Access the site:**
   - Open `http://localhost:8000` in your browser

### GitHub Pages Deployment

This site is configured for GitHub Pages:

1. Push code to the repository
2. Go to Settings → Pages
3. Select the source branch (usually `main` or `master`)
4. Site will be live at: `https://imposterSyndromium.github.io`

## 📝 Blog System

The blog feature is fully functional and easy to manage:

### Adding New Blog Posts

Edit `data/blog-posts.json` and add a new post object:

```json
{
  "id": "unique-post-id",
  "title": "Post Title",
  "excerpt": "Brief excerpt shown on listing page",
  "content": "Full post content with markdown support...",
  "author": "Robin O'Brien",
  "date": "2024-01-20",
  "category": "Development",
  "tags": ["Tag1", "Tag2"],
  "readTime": 5,
  "featured": false
}
```

### Markdown Support

Blog posts support simple markdown syntax:
- Headers: `# H1`, `## H2`, `### H3`
- Lists: `- item` (unordered), `1. item` (ordered)
- Inline code: `` `code` ``
- Paragraphs: Separated by double newlines

### Blog Features

- **Category Filtering**: Filter by Development, Technical, Design, Career
- **Search**: Real-time search across titles, content, and tags
- **Featured Posts**: Highlight important posts
- **Reading Time**: Automatically calculated based on content length
- **Tags**: Organize posts with tags
- **Responsive Design**: Works beautifully on all screen sizes

## 🎨 Customization

### Color Scheme

Colors are defined in `css/styles.css` as CSS variables:

```css
:root {
  --primary-color: #5d27ae;
  --secondary-color: #8f6ad3;
  --text-color: #f5f5f7;
  --background: #000000;
  --card-bg: #1d1d1f;
}
```

### Site Message Banner

Edit `data/site-message.txt` to display a site-wide message banner. Leave it empty to hide the banner.

### Navigation

Update `components/header.html` to modify navigation links.

## 🔧 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: 
  - Fetch API for dynamic content loading
  - Intersection Observer for scroll animations
  - Event delegation and modern DOM APIs
- **No Frameworks**: Pure vanilla JavaScript for optimal performance

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Documentation

Additional documentation is available in the `project-docs/` directory:

- `overview.md`: Project vision and objectives
- `requirements.md`: System requirements and features
- `tech-specs.md`: Technical specifications
- `timeline.md`: Project timeline and progress
- `user-structure.md`: User flow and site structure
- `products.md`: Product documentation

## 🛠️ Development Guidelines

<<<<<<< HEAD
- Email: contact@impostersyndromium.com
=======
### Code Standards

- **Option Strict**: Use strict mode in JavaScript
- **Semantic HTML**: Use appropriate HTML5 semantic elements
- **Accessibility**: Include ARIA labels and proper heading hierarchy
- **Performance**: Optimize images, minimize HTTP requests
- **Comments**: Document complex logic and functions

### File Organization

- Keep files under 1600 lines when possible
- One responsibility per file
- Reusable components in `components/` directory
- Data files in `data/` directory
- Static assets in appropriate folders (`images/`, `resume/`)

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

**Robin O'Brien**
- Email: robin.c.obrien@icloud.com
- Phone: 519.635.2628
- GitHub: [@imposterSyndromium](https://github.com/imposterSyndromium)
- Location: Listowel, ON, Canada

## 🙏 Acknowledgments

- Design inspired by modern portfolio best practices
- Typography: Inter font family from Google Fonts
- Built with attention to performance and accessibility

---

**Last Updated**: January 2024
>>>>>>> de184a4 (Revise README.md to reflect the transition from ImposterSyndromium to Robin O'Brien's personal portfolio website. Update project overview, key features, and structure. Enhance sections for blog functionality, customization options, and development guidelines. Improve accessibility and performance details.)
