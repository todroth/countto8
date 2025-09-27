(function () {
    const numberEl = document.getElementById('number');
    const wrap = document.getElementById('wrap');
    let current = 1; // start at 1
    const MAX = 8;

    function show(n) {
        numberEl.textContent = String(n);
    }

    function bumpAnimation() {
        numberEl.classList.add('pop');
        window.setTimeout(() => numberEl.classList.remove('pop'), 120);
    }

    function advance() {
        current = (current === MAX) ? 1 : (current + 1);
        show(current);
        bumpAnimation();
    }

    // Click / pointer
    wrap.addEventListener('click', (e) => {
        advance();
    });

    // Touch (some devices fire click after touch; pointerdown is reliable but we keep both)
    wrap.addEventListener('touchstart', (e) => {
        // prevent the subsequent click from double-counting on some platforms
        e.preventDefault();
        advance();
    }, {passive: false});

    // Spacebar
    window.addEventListener('keydown', (e) => {
        // avoid typing into inputs — only react when there's no editable focus
        const active = document.activeElement;
        const isEditable = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (isEditable) return;

        if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
            e.preventDefault();
            advance();
        }
    });

    // Accessibility: also allow Enter/Return (optional)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            const active = document.activeElement;
            const isEditable = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
            if (isEditable) return;
            e.preventDefault();
            advance();
        }
    });

    // Start: ensure visible
    show(current);
})();