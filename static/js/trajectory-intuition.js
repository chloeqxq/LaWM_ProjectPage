// Archived trajectory scrubber module. This script is not loaded by default.
(function() {
    const scrubber = document.querySelector("[data-trajectory-scrubber]");

    if (!scrubber) {
        return;
    }

    const range = scrubber.querySelector("[data-trajectory-range]");
    const stepReadout = scrubber.querySelector("[data-trajectory-step]");
    const revealRect = scrubber.querySelector("[data-trajectory-reveal]");

    if (!range || !stepReadout || !revealRect) {
        return;
    }

    function updateScrubber() {
        const value = Number(range.value);
        const max = Number(range.max) || 500;
        const progress = Math.min(1, Math.max(0, value / max));

        range.style.setProperty("--progress", `${progress * 100}%`);
        stepReadout.textContent = String(value).padStart(3, "0");
        revealRect.setAttribute("width", String(progress * 100));
    }

    range.addEventListener("input", updateScrubber);
    updateScrubber();
})();
