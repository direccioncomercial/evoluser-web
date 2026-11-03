        // Lógica de Movimiento EV
        const evContainer = document.getElementById('ev-floating-container');
        let isDragging = false; let startX, startY, initialX, initialY; let hasMoved = false;

        evContainer.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        evContainer.addEventListener('touchstart', (e) => startDragging(e.touches[0]));
        document.addEventListener('touchmove', (e) => drag(e.touches[0]));
        document.addEventListener('touchend', stopDragging);

        function startDragging(e) { isDragging = true; hasMoved = false; startX = e.clientX; startY = e.clientY; initialX = evContainer.offsetLeft; initialY = evContainer.offsetTop; }
        function drag(e) { if (!isDragging) return; hasMoved = true; const dx = e.clientX - startX; const dy = e.clientY - startY; evContainer.style.left = (initialX + dx) + 'px'; evContainer.style.top = (initialY + dy) + 'px'; evContainer.style.bottom = 'auto'; evContainer.style.right = 'auto'; }
        function stopDragging() { isDragging = false; }
        document.getElementById('ev-avatar-trigger').onclick = () => { if (!hasMoved) toggleChat(); };

        function setSegment(segment) {
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
            if(document.getElementById('nav-' + segment)) document.getElementById('nav-' + segment).classList.add('active');
            ['soluciones', 'empresas', 'emprendedores', 'oficina'].forEach(s => { const el = document.getElementById('segment-' + s); if(el) el.classList.add('hidden'); });
            const target = document.getElementById('segment-' + segment); if(target) target.classList.remove('hidden');
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        function handleOfficeSubmit(e) {
            e.preventDefault();
            const id = document.getElementById('ov-id').value; const phone = document.getElementById('ov-phone').value; const city = document.getElementById('ov-city').value; const message = document.getElementById('ov-message').value;
            if(!id || !phone || !message) return;
            const body = encodeURIComponent(`ID: ${id}\nTel: ${phone}\nCiudad: ${city}\n\nMensaje:\n${message}`);
            window.location.href = `mailto:evoluserec@gmail.com?subject=Solicitud Oficina Virtual&body=${body}`;
            document.getElementById('ov-form').classList.add('hidden'); document.getElementById('ov-success').classList.remove('hidden');
        }

        function resetOfficeForm() { document.getElementById('ov-form').classList.remove('hidden'); document.getElementById('ov-success').classList.add('hidden'); document.getElementById('ov-form').reset(); }

        const contentData = {
            filosofia_premium: {
                title: "Filosofía EvoluSer",
                image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
                customHTML: `
                    <div class="space-y-8">
                        <div class="philosophy-block">
                            <h4 class="text-brandGreen font-extrabold uppercase text-[10px] tracking-[0.3em] mb-4 italic">Carta a nuestros Clientes</h4>
                            <div class="text-gray-700 text-sm leading-relaxed text-justify space-y-4 font-bold border-l-4 border-gray-100 pl-4">
                                <p><strong>Estimados Clientes,</strong></p>
                                <p>Presentamos una nueva forma de entender el crecimiento empresarial. Entendemos que una empresa exitosa del siglo XXI debe ser <strong>Humana, Segura, Sostenible y Productiva.</strong></p>
                                <p>En EvoluSer, no somos proveedores, somos sus aliados estratégicos. Nuestra razón de ser es acompañar su evolución técnica y humana para que el éxito sea el resultado natural de una organización sana y responsable.</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div class="border-l-4 border-brandBlue pl-6"><h4 class="text-brandBlue font-extrabold uppercase text-[10px] tracking-widest mb-3">Misión</h4><p class="text-gray-600 text-xs leading-relaxed font-bold">Brindar soluciones técnicas de consultoría con enfoque humano, transformando la cultura organizacional y asegurando el cumplimiento legal para potenciar a su gente.</p></div>
                            <div class="border-l-4 border-brandGreen pl-6"><h4 class="text-brandGreen font-extrabold uppercase text-[10px] tracking-widest mb-3">Visión</h4><p class="text-gray-600 text-xs leading-relaxed font-bold">Ser el referente de excelencia en consultoría integral en la región, demostrando que el bienestar humano es el motor inamovible de la rentabilidad sostenible.</p></div>
                        </div>
                    </div>
                `
            },
            humano: { title: "Gestión de Talento", image: "https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen2.png", leader: "Nury Echeverria", role: "Directora de Talento", desc: "Potenciamos el capital humano con diagnósticos precisos.", list: ["Reclutamiento Senior", "Cultura de Éxito", "Evaluación 360°"] },
            seguro: { title: "Seguridad Industrial", image: "https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen3.png", leader: "Christian Ortega", role: "Director Técnico", desc: "Garantizamos el cumplimiento normativo integral.", list: ["ISO 45001", "Vigilancia Médica", "Riesgos Técnicos"] },
            agro: { title: "Ingeniería Agroindustrial", image: "https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen5.png", leader: "Lilian Eras", role: "Directora Agro", desc: "Optimizamos la cadena de valor alimentaria.", list: ["Certificación BPA", "HACCP", "Diseño Industrial"] },
            sostenible: { title: "Ingeniería Ambiental", image: "https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen3.png", leader: "Christian Ortega", role: "Director Sostenibilidad", desc: "Convertimos la responsabilidad ambiental en rentabilidad real.", list: ["Licencias Verdes", "Huella de Carbono", "Manejo de Desechos"] },
            empresas_info: { title: "Consultoría 360°", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", desc: "Soluciones corporativas de alto impacto estratégico.", list: ["Outsourcing RRHH", "Auditorías ISO", "Plan Estratégico"] },
            emprendedores_info: { title: "Pack Startup", image: "https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen6.png", desc: "Formalización ágil de tu idea de negocio en tiempo récord.", list: ["Constitución Empresa", "Permisos ARCSA", "Imagen Inicial"] },
            equipo: { title: "Directorio", image: "https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen7.jpeg", desc: "Liderazgo multidisciplinario comprometido con la excelencia.", list: ["Dirección Estratégica", "Calidad", "Innovación"] }
        };

        function openModal(type) {
            const data = contentData[type]; if(!data) return;
            const container = document.getElementById('modal-left-container');

            // Lógica Especial para Filosofía (Logo Vertical + Fondo Transparente)
            if (type === 'filosofia_premium') {
                container.innerHTML = `
                    <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('${data.image}');"></div>
                    <div class="relative z-10 flex items-center justify-center h-full w-full">
                        <img src="https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/logo.png"
                             alt="EvoluSer Vertical"
                             class="h-4/5 w-auto object-contain transform -rotate-90 filter drop-shadow-xl"
                             style="max-width: 80%;">
                    </div>
                `;
            } else {
                // Lógica Estándar para el resto
                let imgClass = "w-full h-full object-cover object-top";
                if (['equipo', 'emprendedores_info', 'humano', 'seguro', 'sostenible', 'agro'].includes(type)) {
                    imgClass = "w-full h-full object-contain bg-gray-50";
                }
                container.innerHTML = `<img id="modal-image" src="${data.image}" class="${imgClass}">`;
            }

            let html = `<h3 class="text-3xl font-extrabold text-brandBlue mb-4 uppercase tracking-tighter text-nowrap">${data.title}</h3>`;
            if(data.customHTML) { html += data.customHTML; } else {
                if(data.leader) html += `<div class="mb-6 p-4 bg-gray-50 border-l-4 border-brandGreen font-bold text-sm text-nowrap"><span class="text-gray-800">${data.leader}</span> | <span class="text-brandBlue">${data.role}</span></div>`;
                html += `<p class="text-gray-600 mb-8 leading-relaxed font-bold text-justify text-sm">${data.desc}</p>`;
                if(data.list) { html += `<ul class="space-y-4">`; data.list.forEach(item => html += `<li class="flex items-center text-xs font-extrabold text-gray-700 uppercase tracking-tighter"><i class="fas fa-check-circle text-brandGreen mr-3 text-lg"></i>${item}</li>`); html += `</ul>`; }
                html += `<div class="mt-10"><a href="https://wa.me/593983900050" target="_blank" class="inline-block bg-brandGreen text-white px-10 py-4 rounded-full font-extrabold shadow-brand transition w-full text-center uppercase tracking-widest text-xs">Agendar Consulta</a></div>`;
            }
            document.getElementById('modal-content').innerHTML = html;
            document.getElementById('service-modal').classList.remove('hidden'); document.getElementById('service-modal').classList.add('flex');
        }
        function closeModal() { document.getElementById('service-modal').classList.add('hidden'); }
        function toggleChat() { const win = document.getElementById('ai-chat-window'); if(win.classList.contains('hidden')) { win.classList.remove('hidden'); setTimeout(()=>win.classList.remove('scale-0'),10); } else { win.classList.add('scale-0'); setTimeout(()=>win.classList.add('hidden'),300); } }
        async function handleChat() {
            const input = document.getElementById('chat-input'); const text = input.value; if(!text) return;
            const chatBox = document.getElementById('chat-box'); chatBox.innerHTML += `<li class="flex justify-end"><div class="bg-brandBlue text-white p-3 rounded-2xl rounded-tr-none text-sm font-bold">${text}</div></li>`;
            input.value = ''; chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(() => { chatBox.innerHTML += `<li class="flex justify-start"><div class="bg-white text-gray-700 p-4 rounded-2xl rounded-tl-none shadow-md text-sm border border-gray-100 italic font-medium leading-relaxed font-bold">"Soy Ev. Mi consejo hoy: la inversión en talento y seguridad es el único camino real hacia la rentabilidad infinita. ¿Deseas que agendemos con un director?"</div></li>`; chatBox.scrollTop = chatBox.scrollHeight; }, 1000);
        }

        // --- Lógica del Carrusel (Añadida) ---
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        // Auto-play opcional (comenta esta línea si prefieres solo manual)
        setInterval(nextSlide, 6000);

        // --- Efecto Letras Giratorias (Slogan) ---
        document.addEventListener('DOMContentLoaded', () => {
            const slogan = document.getElementById('slogan-animado');
            if(slogan) {
                const text = slogan.innerText;
                // Dividimos por letras pero respetamos espacios para el responsive
                slogan.innerHTML = text.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    return `<span class="inline-block" style="animation: spinLetters 8s ease-in-out infinite; animation-delay: ${i * 0.03}s; transform-style: preserve-3d; backface-visibility: hidden;">${char}</span>`;
                }).join('');
            }
        });

        // --- JS para el Cursor Personalizado ---
        const cursor = document.getElementById('custom-cursor');

        // Mover cursor
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Efecto Hover en elementos interactivos
        const interactables = document.querySelectorAll('a, button, input, textarea, select, .cursor-pointer');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        // Re-aplicar listeners cuando se abren modales o cambia contenido dinámico
        const observer = new MutationObserver((mutations) => {
             const newInteractables = document.querySelectorAll('a, button, input, textarea, select, .cursor-pointer');
             newInteractables.forEach(el => {
                el.removeEventListener('mouseenter', () => cursor.classList.add('hovering'));
                el.removeEventListener('mouseleave', () => cursor.classList.remove('hovering'));
                el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
