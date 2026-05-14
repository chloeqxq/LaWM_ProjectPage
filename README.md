# LaWM Project Page

Static project page for:

**LaWM: Least Action World Models for Long-Horizon Physical Consistency from Visual Observations**

The page is implemented as a no-build HTML/CSS/JS site and is ready for GitHub Pages.

Project page: <https://chloeqxq.github.io/LaWM_ProjectPage/>

Code repository: <https://github.com/chloeqxq/LaWM>

## Files

```text
.
├── index.html
├── LaWM.pdf
├── static/
│   ├── css/              # Page styles
│   ├── figures/          # Intro, visual results, and ablation figures
│   ├── js/               # Page interactions
│   ├── logo/             # Page, link, and easter-egg logos
│   ├── partials/         # Archived optional modules
│   └── videos/           # Physics-clean rollout demos
└── README.md
```

## Local Preview

```bash
cd /home/qixinxiao/projectPage/LaWM_ProjectPage
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Features

- Clean LaWM hero section with paper links.
- Interactive method stepper for the latent variational integrator.
- Canvas orb interaction with a Michigan easter egg.
- Intro figure, physics-clean video demos, qualitative strips, ablation diagnostics, and results tables.
- Paper, arXiv, and code repository links.

## Deployment

Push this directory to a GitHub Pages repository or publish it from the repository root. No build step is required.
