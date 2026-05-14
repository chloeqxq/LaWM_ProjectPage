        (function() {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }

            sessionStorage.removeItem("lawm-scroll-y");
            window.scrollTo(0, 0);
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
            });
        })();

        (function() {
            const navLinks = document.querySelectorAll(".nav-link");
            const sections = document.querySelectorAll("[id$='-section']");
            const progress = document.getElementById("scroll-progress");

            navLinks.forEach((link) => {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    const targetSection = document.querySelector(link.getAttribute("href"));
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 40,
                            behavior: "smooth"
                        });
                    }
                });
            });

            function updateActiveSection() {
                const scrollPosition = window.scrollY + 140;
                let activeId = "overview-section";

                sections.forEach((section) => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        activeId = section.id;
                    }
                });

                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.dataset.section === activeId);
                });

                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
                progress.style.width = `${scrollProgress}%`;
            }

            window.addEventListener("scroll", updateActiveSection, { passive: true });
            updateActiveSection();
        })();

        (function() {
            const steps = [
                {
                    eyebrow: "Step 01",
                    title: "Encode Observations",
                    text: "Visual frames are mapped into learned generalized coordinates, giving the model compact coordinates where dynamics can be organized.",
                    mathIntro: "Each observation is encoded into a generalized coordinate where the later variational dynamics operate.",
                    formulas: [
                        {
                            label: "Generalized coordinate",
                            expression: "q<sub>k</sub> = E<sub>&phi;</sub>(x<sub>k</sub>)"
                        }
                    ],
                    mathNote: "The encoder supplies compact generalized coordinates for the downstream least-action rollout."
                },
                {
                    eyebrow: "Step 02",
                    title: "Learn Ld",
                    text: "A Latent Lagrangian is learned over neighboring generalized coordinates, making the physical principle part of the representation rather than an external loss.",
                    mathIntro: "The model learns a discrete Latent Lagrangian over adjacent generalized coordinates.",
                    formulas: [
                        {
                            label: "Latent Lagrangian",
                            expression: "L<sub>d,&theta;</sub>(q<sub>k</sub>, q<sub>k+1</sub>)"
                        }
                    ],
                    mathNote: "This learned scalar function is the quantity accumulated by the action."
                },
                {
                    eyebrow: "Step 03",
                    title: "Construct Action",
                    text: "LaWM accumulates local Latent Lagrangian terms into a discrete action functional over the rollout horizon.",
                    mathIntro: "Local Latent Lagrangian terms are summed into a discrete action over the trajectory.",
                    formulas: [
                        {
                            label: "Discrete action",
                            expression: "S<sub>d</sub>(q<sub>0:T</sub>) = <span class=\"sum-symbol\">&sum;</span><sub>k=0</sub><sup>T-1</sup> L<sub>d,&theta;</sub>(q<sub>k</sub>, q<sub>k+1</sub>)"
                        }
                    ],
                    mathNote: "The rollout is evaluated as a whole trajectory rather than independent one-step transitions."
                },
                {
                    eyebrow: "Step 04",
                    title: "Solve DEL",
                    text: "The next generalized coordinate is obtained by satisfying the discrete Euler-Lagrange condition, turning least action into the transition rule itself.",
                    mathIntro: "The next generalized coordinate is selected by enforcing stationarity of the discrete action.",
                    formulas: [
                        {
                            label: "Stationarity",
                            expression: "D<sub>2</sub>L<sub>d,&theta;</sub>(q<sub>k-1</sub>, q<sub>k</sub>) + D<sub>1</sub>L<sub>d,&theta;</sub>(q<sub>k</sub>, q<sub>k+1</sub>) = 0"
                        }
                    ],
                    mathNote: "This is where the least-action principle becomes the transition rule."
                },
                {
                    eyebrow: "Step 05",
                    title: "Decode Rollout",
                    text: "The structure-preserving generalized-coordinate trajectory is decoded back into future visual observations for long-horizon prediction.",
                    mathIntro: "The resulting generalized-coordinate trajectory is decoded back to the observation space.",
                    formulas: [
                        {
                            label: "Prediction",
                            expression: "x&#770;<sub>k+1</sub> = D<sub>&psi;</sub>(q<sub>k+1</sub>)"
                        }
                    ],
                    mathNote: "The visual rollout inherits the structure preserved by the latent variational update."
                }
            ];

            const stepButtons = document.querySelectorAll(".method-step");
            const detailCard = document.getElementById("method-detail-card");
            const eyebrow = document.getElementById("method-detail-eyebrow");
            const title = document.getElementById("method-detail-title");
            const text = document.getElementById("method-detail-text");
            const mathIntro = document.getElementById("method-math-intro");
            const formulaRows = document.getElementById("method-formula-rows");
            const formulaNote = document.getElementById("method-formula-note");

            if (!stepButtons.length || !detailCard || !eyebrow || !title || !text || !mathIntro || !formulaRows || !formulaNote) {
                return;
            }

            function renderFormulaRows(formulas) {
                formulaRows.innerHTML = formulas.map((formula) => `
                    <div class="formula-row">
                        <span class="formula-label">${formula.label}</span>
                        <div class="formula">${formula.expression}</div>
                    </div>
                `).join("");
            }

            function setStep(index) {
                const step = steps[index];

                if (!step) {
                    return;
                }

                stepButtons.forEach((button, buttonIndex) => {
                    const isActive = buttonIndex === index;
                    button.classList.toggle("active", isActive);
                    button.setAttribute("aria-selected", String(isActive));
                });

                detailCard.classList.add("updating");

                window.setTimeout(() => {
                    eyebrow.textContent = step.eyebrow;
                    title.textContent = step.title;
                    text.textContent = step.text;
                    mathIntro.textContent = step.mathIntro;
                    renderFormulaRows(step.formulas);
                    formulaNote.textContent = step.mathNote;
                    detailCard.classList.remove("updating");
                }, 120);
            }

            stepButtons.forEach((button) => {
                const index = Number(button.dataset.step);
                button.addEventListener("mouseenter", () => setStep(index));
                button.addEventListener("focus", () => setStep(index));
                button.addEventListener("click", () => setStep(index));
            });
        })();

        (function() {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const canvas = document.getElementById("hero-canvas");
            const header = document.querySelector("header");
            const floatingNav = document.querySelector(".floating-nav");

            if (!canvas || !header || prefersReducedMotion) {
                return;
            }

            const ctx = canvas.getContext("2d");
            const pointer = { x: 0.5, y: 0.5 };
            let width = 0;
            let height = 0;
            let dpr = 1;
            let startTime = performance.now();
            let lastFrame = startTime;
            let cyclePhase = 0;
            let sideBlend = 0;
            let sideLane = 1;
            const motion = { x: 0, y: 0, vx: 0, vy: 0, free: 0, energy: 0, ready: false };
            const currentOrb = { x: 0, y: 0, radius: 24 };
            const sidePlay = { phase: 0, amplitude: 0, flight: 0, targetLane: 1 };
            const ripples = [];
            const puffs = [];
            const maizeBursts = [];
            const logoPops = [];
            const clickCombo = { count: 0, lastAt: 0 };
            const mLogo = new Image();
            mLogo.src = "static/logo/M.png";

            function clamp(value, min, max) {
                return Math.min(max, Math.max(min, value));
            }

            function getNavProtectionX(radius) {
                if (!floatingNav || window.innerWidth <= 1200) {
                    return 0;
                }

                const rect = floatingNav.getBoundingClientRect();
                return rect.right + Math.max(34, radius * 1.8);
            }

            function getSideBounds(radius) {
                const contentWidth = Math.min(1040, Math.max(0, width - 40));
                const contentLeft = width / 2 - contentWidth / 2;
                const contentRight = width / 2 + contentWidth / 2;
                const margin = 26;
                const safeInset = Math.max(58, radius * 2.4);
                const verticalInset = Math.max(64, radius * 2.6);

                if (sideLane < 0) {
                    let left = Math.max(safeInset, getNavProtectionX(radius));
                    let right = contentLeft - margin;

                    if (right - left < radius * 4) {
                        sideLane = 1;
                        left = contentRight + margin;
                        right = width - safeInset;

                        if (right - left < radius * 4) {
                            left = clamp(width * 0.64, safeInset, right - radius * 4);
                        }
                    }

                    return { left, right, top: verticalInset, bottom: height - verticalInset };
                }

                let left = contentRight + margin;
                let right = width - safeInset;

                if (right - left < radius * 4) {
                    left = clamp(width * 0.64, safeInset, right - radius * 4);
                }

                return { left, right, top: verticalInset, bottom: height - verticalInset };
            }

            function resizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                width = Math.max(1, rect.width);
                height = Math.max(1, rect.height);
                canvas.width = Math.floor(width * dpr);
                canvas.height = Math.floor(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            function parabolaPoint(t, lift) {
                const x = width * (0.12 + 0.76 * t);
                const baseline = height * (0.72 + (pointer.y - 0.5) * 0.08);
                const arc = Math.sin(Math.PI * t) * (height * (0.34 + lift));
                const wobble = Math.sin(t * Math.PI * 2 + pointer.x * 1.6) * 8;
                return { x, y: baseline - arc + wobble };
            }

            function sidePoint(t, elapsed) {
                const angle = t * Math.PI * 2;
                const bounds = getSideBounds(24);
                const sideX = (bounds.left + bounds.right) / 2;
                const horizontalRoom = Math.max(14, (bounds.right - bounds.left) * 0.2);
                const driftY = height * (0.33 + 0.22 * (0.5 + 0.5 * Math.sin(elapsed * 0.055)));
                const play = sidePlay.amplitude;

                return {
                    x: sideX + Math.cos(angle * 0.62 + elapsed * 0.045) * horizontalRoom - sideLane * Math.sin(sidePlay.phase) * 42 * play,
                    y: driftY + Math.sin(angle * 0.5 + elapsed * 0.07) * 58 + Math.cos(sidePlay.phase * 1.12) * 74 * play
                };
            }

            function getSideMode() {
                const headerRect = header.getBoundingClientRect();
                const transitionStart = window.innerHeight * 0.62;
                const transitionRange = window.innerHeight * 0.42;
                return clamp((transitionStart - headerRect.bottom) / transitionRange, 0, 1);
            }

            function orbPoint(t, lift, elapsed, sideMode) {
                const heroPoint = parabolaPoint(t, lift * (1 - sideMode));
                const sideDrift = sidePoint(t, elapsed);
                const ease = sideMode * sideMode * (3 - 2 * sideMode);

                return {
                    x: heroPoint.x * (1 - ease) + sideDrift.x * ease,
                    y: heroPoint.y * (1 - ease) + sideDrift.y * ease
                };
            }

            function drawLatentOrb(x, y, radius, spin, energy) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(spin);

                const haloRadius = radius * (2.35 + energy * 0.9);
                const halo = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, haloRadius);
                halo.addColorStop(0, `rgba(142, 203, 255, ${0.2 + energy * 0.16})`);
                halo.addColorStop(0.45, `rgba(255, 226, 145, ${0.12 + energy * 0.1})`);
                halo.addColorStop(1, "rgba(142, 203, 255, 0)");
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
                ctx.fill();

                const gradient = ctx.createRadialGradient(-radius * 0.35, -radius * 0.45, radius * 0.08, 0, 0, radius);
                gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
                gradient.addColorStop(0.45, "rgba(196, 226, 255, 0.86)");
                gradient.addColorStop(1, "rgba(78, 139, 199, 0.72)");

                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.strokeStyle = "rgba(49, 95, 146, 0.28)";
                ctx.lineWidth = 1.1;
                ctx.stroke();

                ctx.strokeStyle = "rgba(49, 95, 146, 0.2)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, radius * 1.18, radius * 0.34, 0, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(0, 0, radius * 1.18, radius * 0.34, Math.PI / 2.7, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
                ctx.beginPath();
                ctx.arc(-radius * 0.28, -radius * 0.32, radius * 0.16, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            function addRipple(x, y, strength) {
                ripples.push({
                    x,
                    y,
                    strength,
                    startedAt: performance.now()
                });

                if (ripples.length > 8) {
                    ripples.shift();
                }
            }

            function drawRipples(now) {
                for (let i = ripples.length - 1; i >= 0; i -= 1) {
                    const ripple = ripples[i];
                    const age = (now - ripple.startedAt) / 1000;

                    if (age > 1.4) {
                        ripples.splice(i, 1);
                        continue;
                    }

                    const progress = age / 1.4;
                    const radius = 18 + progress * (110 + ripple.strength * 50);
                    const alpha = (1 - progress) * (0.22 + ripple.strength * 0.16);

                    ctx.save();
                    ctx.lineWidth = 1.3;
                    ctx.strokeStyle = `rgba(49, 95, 146, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.strokeStyle = `rgba(255, 226, 145, ${alpha * 0.65})`;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, radius * 0.58, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            function addPuff(x, y, directionX, directionY, strength) {
                const count = Math.round(7 + strength * 7);
                const baseAngle = Math.atan2(directionY, directionX);

                for (let i = 0; i < count; i += 1) {
                    const spread = (Math.random() - 0.5) * Math.PI * 0.9;
                    const speed = 26 + Math.random() * 48 + strength * 28;
                    const angle = baseAngle + Math.PI + spread;

                    puffs.push({
                        x,
                        y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 12,
                        radius: 2 + Math.random() * 3.5,
                        ttl: 0.9 + Math.random() * 0.55,
                        startedAt: performance.now()
                    });
                }

                if (puffs.length > 42) {
                    puffs.splice(0, puffs.length - 42);
                }
            }

            function addMaizeBurst(x, y) {
                const now = performance.now();
                const particles = [];

                for (let i = 0; i < 34; i += 1) {
                    const angle = (Math.PI * 2 * i) / 34 + (Math.random() - 0.5) * 0.32;
                    const speed = 70 + Math.random() * 150;

                    particles.push({
                        x,
                        y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 18,
                        radius: 2.2 + Math.random() * 4.2
                    });
                }

                maizeBursts.push({ x, y, particles, startedAt: now });

                if (maizeBursts.length > 3) {
                    maizeBursts.shift();
                }
            }

            function drawMaizeBursts(now, dt) {
                for (let i = maizeBursts.length - 1; i >= 0; i -= 1) {
                    const burst = maizeBursts[i];
                    const age = (now - burst.startedAt) / 1000;

                    if (age > 1.35) {
                        maizeBursts.splice(i, 1);
                        continue;
                    }

                    const progress = age / 1.35;
                    const glowRadius = 18 + progress * 150;
                    const glow = ctx.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, glowRadius);
                    glow.addColorStop(0, `rgba(255, 203, 5, ${0.34 * (1 - progress)})`);
                    glow.addColorStop(0.48, `rgba(255, 226, 145, ${0.18 * (1 - progress)})`);
                    glow.addColorStop(1, "rgba(255, 203, 5, 0)");

                    ctx.save();
                    ctx.globalCompositeOperation = "screen";
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(burst.x, burst.y, glowRadius, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = `rgba(255, 203, 5, ${0.42 * (1 - progress)})`;
                    ctx.beginPath();
                    ctx.arc(burst.x, burst.y, 28 + progress * 96, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();

                    burst.particles.forEach((particle) => {
                        particle.x += particle.vx * dt;
                        particle.y += particle.vy * dt;
                        particle.vx *= Math.exp(-1.45 * dt);
                        particle.vy = particle.vy * Math.exp(-1.2 * dt) + 24 * dt;

                        ctx.save();
                        ctx.globalAlpha = (1 - progress) * 0.82;
                        ctx.fillStyle = progress < 0.58 ? "rgba(255, 203, 5, 0.92)" : "rgba(255, 226, 145, 0.72)";
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.radius * (1 - progress * 0.35), 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    });
                }
            }

            function addLogoPop(x, y, radius) {
                logoPops.push({
                    x,
                    y,
                    radius,
                    startedAt: performance.now()
                });

                if (logoPops.length > 2) {
                    logoPops.shift();
                }
            }

            function drawLogoPops(now) {
                if (!mLogo.complete || !mLogo.naturalWidth) {
                    return;
                }

                for (let i = logoPops.length - 1; i >= 0; i -= 1) {
                    const pop = logoPops[i];
                    const age = (now - pop.startedAt) / 1000;

                    if (age > 2.4) {
                        logoPops.splice(i, 1);
                        continue;
                    }

                    const rise = Math.sin(Math.min(1, age / 1.05) * Math.PI * 0.5) * pop.radius * 2.1;
                    const fadeOut = age > 1.65 ? 1 - (age - 1.65) / 0.75 : 1;
                    const intro = clamp(age / 0.34, 0, 1);
                    const size = pop.radius * (1.2 + 0.42 * Math.sin(intro * Math.PI * 0.5));
                    const x = pop.x - size / 2;
                    const y = pop.y - rise - size * 0.72;

                    ctx.save();
                    ctx.globalAlpha = Math.max(0, fadeOut) * intro;
                    ctx.translate(x + size / 2, y + size / 2);
                    ctx.rotate(Math.sin(age * 4) * 0.04);
                    ctx.shadowColor = "rgba(255, 203, 5, 0.42)";
                    ctx.shadowBlur = 18;
                    ctx.drawImage(mLogo, -size / 2, -size / 2, size, size * (mLogo.naturalHeight / mLogo.naturalWidth));
                    ctx.restore();
                }
            }

            function registerOrbClick() {
                const now = performance.now();

                clickCombo.count = now - clickCombo.lastAt < 950 ? clickCombo.count + 1 : 1;
                clickCombo.lastAt = now;

                if (clickCombo.count < 4) {
                    return;
                }

                clickCombo.count = 0;
                motion.energy = 1;
                addMaizeBurst(currentOrb.x, currentOrb.y);
                addLogoPop(currentOrb.x, currentOrb.y, currentOrb.radius);
                addRipple(currentOrb.x, currentOrb.y, 1);
            }

            function drawPuffs(now, dt) {
                for (let i = puffs.length - 1; i >= 0; i -= 1) {
                    const puff = puffs[i];
                    const age = (now - puff.startedAt) / 1000;

                    if (age > puff.ttl) {
                        puffs.splice(i, 1);
                        continue;
                    }

                    const progress = age / puff.ttl;
                    puff.x += puff.vx * dt;
                    puff.y += puff.vy * dt;
                    puff.vx *= Math.exp(-1.25 * dt);
                    puff.vy = puff.vy * Math.exp(-1.1 * dt) - 8 * dt;

                    ctx.save();
                    ctx.globalAlpha = (1 - progress) * 0.58;
                    ctx.fillStyle = progress < 0.45 ? "rgba(142, 203, 255, 0.72)" : "rgba(255, 226, 145, 0.6)";
                    ctx.beginPath();
                    ctx.arc(puff.x, puff.y, puff.radius * (1 + progress * 0.9), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            function draw(now) {
                const elapsed = (now - startTime) / 1000;
                const dt = Math.min(0.04, (now - lastFrame) / 1000 || 0.016);
                lastFrame = now;
                const targetSideMode = getSideMode();
                const blendRate = targetSideMode > sideBlend ? 0.42 : 1.65;
                sideBlend += (targetSideMode - sideBlend) * (1 - Math.exp(-blendRate * dt));

                if (targetSideMode < 0.08 && currentOrb.x > 0) {
                    sideLane = currentOrb.x < width * 0.5 ? -1 : 1;
                }

                sidePlay.phase += dt * (1.1 + sidePlay.amplitude * 2.2);
                sidePlay.amplitude *= Math.exp(-1.15 * dt);
                sidePlay.flight *= Math.exp(-0.5 * dt);

                const cycleSpeed = 0.105 * (1 - sideBlend) + 0.018 * sideBlend;
                cyclePhase = (cyclePhase + cycleSpeed * dt) % 1;

                const sideMode = sideBlend;
                const cycle = (cyclePhase + pointer.x * 0.05 * (1 - sideMode)) % 1;
                const lift = (0.5 - pointer.y) * 0.08 * (1 - sideMode);
                const baseRadius = Math.max(18, Math.min(34, width * 0.028));
                const radius = baseRadius * (1 - sideMode * 0.18);

                ctx.clearRect(0, 0, width, height);

                const trail = [];
                for (let i = 0; i <= 72; i += 1) {
                    trail.push(orbPoint(i / 72, lift, elapsed, sideMode));
                }

                ctx.save();
                ctx.lineWidth = 1.6;
                ctx.strokeStyle = `rgba(49, 95, 146, ${0.13 * (1 - sideMode * 0.78)})`;
                ctx.setLineDash([4, 10]);
                ctx.beginPath();
                trail.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.stroke();
                ctx.restore();

                drawRipples(now);
                drawPuffs(now, dt);
                drawMaizeBursts(now, dt);

                for (let i = 0; i < 7; i += 1) {
                    const t = (cycle - i * 0.035 + 1) % 1;
                    const point = orbPoint(t, lift, elapsed, sideMode);
                    const alpha = Math.max(0, (0.12 - i * 0.015) * (1 - sideMode * 0.35));
                    ctx.fillStyle = `rgba(142, 203, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, radius * (1 - i * 0.065), 0, Math.PI * 2);
                    ctx.fill();
                }

                const ball = orbPoint(cycle, lift, elapsed, sideMode);
                if (!motion.ready) {
                    motion.x = ball.x;
                    motion.y = ball.y;
                    motion.ready = true;
                }

                if (motion.free > 0) {
                    motion.free = Math.max(0, motion.free - dt);
                    motion.vy += (16 + Math.sin(elapsed * 0.9) * 18) * dt;
                    motion.vx *= Math.exp(-0.18 * dt);
                    motion.vy *= Math.exp(-0.22 * dt);

                    if (motion.free === 0) {
                        sideLane = motion.x < width * 0.5 ? -1 : 1;
                    }
                } else {
                    const stiffness = 8.4 * (1 - sideMode) + 4.2 * sideMode;
                    const damping = 5.9 * (1 - sideMode) + 4.1 * sideMode;

                    motion.vx += ((ball.x - motion.x) * stiffness - motion.vx * damping) * dt;
                    motion.vy += ((ball.y - motion.y) * stiffness - motion.vy * damping) * dt;
                }

                canvas.classList.toggle("playing", motion.free > 0.18 || motion.energy > 0.42 || maizeBursts.length > 0 || logoPops.length > 0);

                if (sideMode > 0.55 && motion.free <= 0.12) {
                    const cursorX = pointer.x * width;
                    const cursorY = pointer.y * height;
                    const hoverDx = motion.x - cursorX;
                    const hoverDy = motion.y - cursorY;
                    const hoverDistance = Math.hypot(hoverDx, hoverDy) || 1;
                    const hoverRadius = radius * 6.4;

                    if (hoverDistance < hoverRadius) {
                        const breeze = Math.pow(1 - hoverDistance / hoverRadius, 2);
                        motion.vx += (hoverDx / hoverDistance) * 170 * breeze * dt;
                        motion.vy += (hoverDy / hoverDistance) * 130 * breeze * dt;
                        motion.energy = clamp(motion.energy + breeze * 0.035, 0, 0.72);
                    }
                }

                motion.x += motion.vx * dt;
                motion.y += motion.vy * dt;
                motion.energy *= Math.exp(-2.7 * dt);

                currentOrb.x = motion.x;
                currentOrb.y = motion.y;
                currentOrb.radius = radius;

                if (sideMode > 0.55) {
                    const sideBounds = getSideBounds(radius);

                    if (motion.free > 0) {
                        if (currentOrb.y < sideBounds.top) {
                            motion.vy += (sideBounds.top - currentOrb.y) * 1.4 * dt;
                        } else if (currentOrb.y > sideBounds.bottom) {
                            motion.vy -= (currentOrb.y - sideBounds.bottom) * 1.4 * dt;
                        }
                    } else if (currentOrb.y < sideBounds.top || currentOrb.y > sideBounds.bottom) {
                        currentOrb.y = clamp(currentOrb.y, sideBounds.top, sideBounds.bottom);
                        motion.y = currentOrb.y;
                        motion.vy *= 0.18;
                    }
                }

                drawLatentOrb(currentOrb.x, currentOrb.y, radius, elapsed * (1.2 + motion.energy * 0.9), motion.energy);
                drawLogoPops(now);

                requestAnimationFrame(draw);
            }

            window.addEventListener("pointermove", (event) => {
                const rect = canvas.getBoundingClientRect();
                pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
                pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
            });

            window.addEventListener("pointerdown", (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const dx = currentOrb.x - x;
                const dy = currentOrb.y - y;
                const distance = Math.hypot(dx, dy) || 1;
                const sideMode = sideBlend;
                const interactionRadius = currentOrb.radius * (motion.free > 0 ? 12.5 : (sideMode > 0.65 ? 7.2 : 5.2));
                const nearOrb = distance < interactionRadius;

                if (sideMode > 0.65 && !nearOrb) {
                    return;
                }

                const direction = nearOrb ? 1 : -0.45;
                const strength = nearOrb ? clamp(1 - distance / interactionRadius, 0.35, 1) : 0.34 * (1 - sideMode);

                if (nearOrb) {
                    registerOrbClick();
                } else {
                    clickCombo.count = 0;
                }

                if (sideMode > 0.65) {
                    const swatX = dx / distance;
                    const swatY = dy / distance;
                    const launchLane = swatX < 0 ? -1 : 1;
                    sidePlay.targetLane = -launchLane;
                    sidePlay.phase += Math.PI * 0.45;
                    sidePlay.amplitude = clamp(sidePlay.amplitude + 0.95 * strength, 0, 1.15);
                    sidePlay.flight = 1;
                    motion.free = 5.2;
                    motion.vx = motion.vx * 0.32 + swatX * (Math.min(width * 0.23, 300) + 95 * strength);
                    motion.vy = motion.vy * 0.32 + swatY * (Math.min(height * 0.12, 145) + 70 * strength);
                    motion.energy = clamp(motion.energy + 0.82 * strength, 0, 1);
                    addRipple(currentOrb.x, currentOrb.y, strength);
                    window.setTimeout(() => addRipple(currentOrb.x, currentOrb.y, strength * 0.62), 90);
                    addPuff(currentOrb.x, currentOrb.y, motion.vx, motion.vy, strength);
                    return;
                }

                motion.free = Math.max(motion.free, 2.2);
                motion.vx += (dx / distance) * direction * (210 + 120 * strength);
                motion.vy += (dy / distance) * direction * (210 + 120 * strength) - 45 * strength;
                motion.energy = clamp(motion.energy + 0.8 * strength, 0, 1);

                addRipple(nearOrb ? currentOrb.x : x, nearOrb ? currentOrb.y : y, strength);
                addPuff(nearOrb ? currentOrb.x : x, nearOrb ? currentOrb.y : y, motion.vx, motion.vy, strength);
            });

            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();
            requestAnimationFrame(draw);
        })();

        (function() {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const revealItems = document.querySelectorAll(
                ".section, .highlight-card, .result-card, .method-step, .method-detail-card, .method-math-details, .media-card, .table-wrap"
            );

            revealItems.forEach((item, index) => {
                item.classList.add("reveal");
                item.style.transitionDelay = `${Math.min(index % 8, 5) * 45}ms`;
            });

            if (prefersReducedMotion) {
                revealItems.forEach((item) => item.classList.add("visible"));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: "0px 0px -8% 0px",
                threshold: 0.12
            });

            revealItems.forEach((item) => observer.observe(item));
        })();
