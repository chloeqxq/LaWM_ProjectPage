# LaWM Project Page

Static project page for:

**LaWM: Least Action World Models for Long-Horizon Physical Consistency from Visual Observations**

The page is implemented as a no-build HTML/CSS/JS site and is ready for GitHub Pages.

## Files

```text
.
├── index.html
├── LaWM.pdf
├── static/
│   ├── dataset/          # RGB/depth GIFs and GLB meshes
│   ├── figures/          # Intro, visual results, and ablation figures
│   ├── logo/             # Lab and link icons
│   ├── suds_training/    # Stereo image pairs
│   └── uw_sim/           # Interactive underwater simulation layers
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
- Canvas demo comparing least-action rollouts with unconstrained drift.
- Intro figure, experiment visualizations, ablation diagnostics, and results tables.
- RGB/depth GIF scene tabs.
- GLB mesh previews via `model-viewer`.
- Underwater simulation layer mixer.
- Stereo left/right comparison slider.

## Deployment

Push this directory to a GitHub Pages repository or publish it from the repository root. No build step is required.
