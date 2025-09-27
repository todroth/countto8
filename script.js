(function(){
    const numberEl = document.getElementById('number');
    const wrap = document.getElementById('wrap');
    const STORAGE_KEY = 'counterValue';
    const MAX = 8;
    let wakeLock = null;

    let current = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (isNaN(current) || current < 1 || current > MAX) {
        current = 1;
    }

    function show(n){
        numberEl.textContent = String(n);
    }

    function bumpAnimation(){
        numberEl.classList.add('pop');
        window.setTimeout(()=>numberEl.classList.remove('pop'), 120);
    }

    function advance(){
        current = (current === MAX) ? 1 : (current + 1);
        localStorage.setItem(STORAGE_KEY, current);
        show(current);
        bumpAnimation();
    }

    wrap.addEventListener('click', ()=>{
        advance();
    });

    wrap.addEventListener('touchstart', (e)=>{
        e.preventDefault();
        advance();
    }, {passive:false});

    window.addEventListener('keydown', (e)=>{
        const active = document.activeElement;
        const isEditable = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if(isEditable) return;

        if(e.code === 'Space' || e.key === ' ' || e.keyCode === 32){
            e.preventDefault();
            advance();
        }
    });

    window.addEventListener('keydown', (e)=>{
        if(e.code === 'Enter'){
            const active = document.activeElement;
            const isEditable = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
            if(isEditable) return;
            e.preventDefault();
            advance();
        }
    });

    // Wake Lock API
    async function requestWakeLock(){
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await navigator.wakeLock.request('screen');
                wakeLock.addEventListener('release', ()=>{
                    console.log('Wake Lock was released');
                });
                console.log('Wake Lock is active');
            }
        } catch(err) {
            console.error(`Wake Lock error: ${err.name}, ${err.message}`);
        }
    }

    // re-request on visibility change
    document.addEventListener('visibilitychange', ()=>{
        if (wakeLock !== null && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    });

    show(current);
    requestWakeLock();
})();