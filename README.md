# Robin O'Brien - Personal Portfolio

A responsive personal website centred on Robin O'Brien: his professional story,
independent apps, technical work, experience, résumé, and contact information.
Built with semantic HTML, CSS, and vanilla JavaScript.

## Site flow

- **Home** - Robin's story, selected work, experience, and contact
- **Apps** - Moving Truth and the Inner app family
- **Experience** - Enterprise IT, manufacturing systems, and software projects
- **Résumé** - An accessible professional overview and downloadable one-page PDF
- **Contact** - Email and GitHub

The signature line **“Make Change. Be Swift. Think Different.”** appears between
the homepage introduction and Robin's story.

## Structure

```text
├── index.html
├── components/           # Shared header and footer
├── css/styles.css
├── data/site-message.txt
├── images/
├── js/                   # Shared component and interaction scripts
├── pages/
│   ├── apps.html
│   ├── resume.html
│   ├── highlights/
│   └── products/
├── resume/
│   ├── RobinOBrien_Resume_20260802.pdf
│   └── src/resume.html
└── project-docs/
```

## Local preview

From the repository root, start any static web server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The site is published through GitHub Pages from the repository's `main` branch
at [robinobrien.me](https://robinobrien.me).

## Updating the site

- Edit `components/header.html` and `components/footer.html` for shared navigation.
- Edit `data/site-message.txt` for the announcement banner.
- Edit `resume/src/resume.html`, then regenerate the PDF when the résumé changes.
- Keep accessibility, responsive behaviour, and reduced-motion support intact.

## Contact

- Robin O'Brien
- Listowel, Ontario
- robin.c.obrien@icloud.com
