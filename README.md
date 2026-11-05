# Portfolio — Harshad Chaudhary

Personal portfolio for **Harshad Chaudhary**, Junior .NET Backend Developer.
Static HTML/CSS/JS, no build step, served by GitHub Pages at
<https://harshadchaudhary.github.io/portfolio/>.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero, tech stack, what I do, how I work |
| `experience.html` | Locobuzz roles, architecture diagram, technical skills |
| `projects.html` | Production backend work, then public GitHub projects |
| `about.html` | Background, journey, education and certifications |
| `resume.html` | On-screen resume; the source the PDF is rendered from |
| `contact.html` | Contact form and links |

Shared assets: `style.css` (every page), `script.js` (mobile nav, footer year,
contact form).

## Editing

- **Content** lives directly in the HTML — no templating, so edit the page you mean.
- **Colours and spacing** are CSS custom properties at the top of `style.css`
  (`:root`). Changing `--accent` restyles the whole site.
- The nav is duplicated in each page's `<header>`; update all six when adding a page.

## Rebuilding the resume PDF

`Harshad_Chaudhary_Backend_Engineer_Resume.pdf` is generated from `resume.html`.
After editing the resume, regenerate it:

```powershell
powershell -ExecutionPolicy Bypass -File build-resume.ps1
```

Or open `resume.html` in a browser and use **Ctrl+P → Save as PDF**
(the page has print styles that hide the nav and footer).

## Notes

- The contact form has no backend — a static host can't send mail. Submitting
  opens the visitor's mail client with the message pre-filled. To get real inbox
  delivery, point the form at a service such as Formspree or Web3Forms.
- Work at Locobuzz is described by capability only. Internal service names,
  hostnames, identifiers and credentials must never appear on this site.
