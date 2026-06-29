function handleOfficeSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('ov-id').value; const phone = document.getElementById('ov-phone').value; const city = document.getElementById('ov-city').value; const message = document.getElementById('ov-message').value;
    if(!id || !phone || !message) return;
    const body = encodeURIComponent(`ID: ${id}\nTel: ${phone}\nCiudad: ${city}\n\nMensaje:\n${message}`);
    window.location.assign(`mailto:evoluserec@gmail.com?subject=Solicitud Oficina Virtual&body=${body}`);
    document.getElementById('ov-form').classList.add('hidden'); document.getElementById('ov-success').classList.remove('hidden');
}

function resetOfficeForm() { document.getElementById('ov-form').classList.remove('hidden'); document.getElementById('ov-success').classList.add('hidden'); document.getElementById('ov-form').reset(); }

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { handleOfficeSubmit, resetOfficeForm };
}
