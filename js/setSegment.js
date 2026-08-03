function setSegment(segment) {
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    if(document.getElementById('nav-' + segment)) document.getElementById('nav-' + segment).classList.add('active');
    ['soluciones', 'empresas', 'emprendedores', 'oficina'].forEach(s => { const el = document.getElementById('segment-' + s); if(el) el.classList.add('hidden'); });
    const target = document.getElementById('segment-' + segment); if(target) target.classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setSegment };
}
