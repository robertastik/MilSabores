function actualizarHeaderSegunEstadoLogin() {
    const estaLogueado = localStorage.getItem('isLoggedIn') === 'true';
    const registroDiv = document.querySelector('.registro');

    if (estaLogueado) {
        registroDiv.innerHTML = `
            <div class="dropdown">
                <span class="icono-usuario"><img src="images/user (1).svg" alt="User Icon"></span>
                <div class="dropdown-content" id="dropdown-content">
                    <a href="perfil.html">Perfil</a>
                    <a href="#" id="cerrar-sesion">Cerrar Sesión</a>
                </div>
            </div>
        `;

        const enlaceCerrarSesion = document.getElementById('cerrar-sesion');
        if (enlaceCerrarSesion) {
            enlaceCerrarSesion.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    }
    
   
    const iconoUsuario = document.querySelector('.icono-usuario') || document.querySelector('.user-icon');
    const contenidoDropdown = document.querySelector('.registro .dropdown-content');

    if (iconoUsuario && contenidoDropdown) {
        iconoUsuario.addEventListener('click', (event) => {
            event.stopPropagation();
            // Ocultar el dropdown de contacto si está abierto
            document.querySelector('.contacto-dropdown-content')?.classList.remove('show');
            contenidoDropdown.classList.toggle('show');
        });

        window.addEventListener('click', (event) => {
            
            if (!iconoUsuario.contains(event.target)) {
                if (contenidoDropdown.classList.contains('show')) {
                    contenidoDropdown.classList.remove('show');
                }
            }
        });
    }
}

function cargarHeader() {
    const marcadorHeader = document.getElementById('header-placeholder');

    if (marcadorHeader) {
        fetch('components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                marcadorHeader.innerHTML = html;

                const menuHamburguesa = document.querySelector('.hamburger-menu');
                const navegacionHeader = document.querySelector('.navegacion-header');

                if (menuHamburguesa && navegacionHeader) {
                    menuHamburguesa.addEventListener('click', () => {
                        navegacionHeader.classList.toggle('show');
                    });
                }
            })
            .then(() => {
                // --- Lógica para el enlace "Sobre Nosotros" ---
                const sobreNosotrosLink = Array.from(document.querySelectorAll('.navegacion-header a'))
                                                  .find(a => a.textContent.trim() === 'Sobre Nosotros');
                if (sobreNosotrosLink) {
                    // Apunta a la sección 'sobre-nosotros' en la página de inicio
                    sobreNosotrosLink.href = 'index.html#sobre-nosotros';
                }

                // dropdown contacto
                const contactoLink = Array.from(document.querySelectorAll('.navegacion-header a'))
                                          .find(a => a.textContent.trim() === 'Contacto');

                if (contactoLink) {
                    contactoLink.href = '#';
                    contactoLink.style.cursor = 'pointer';

                    const dropdownContent = document.createElement('div');
                    dropdownContent.className = 'contacto-dropdown-content';
                    dropdownContent.innerHTML = `
                        <p>Contáctanos en nuestras redes</p>
                        <div class="social-buttons">
                            <button><img src="images/fb-png.png" alt="Facebook"></button>
                            <button><img src="images/ig-png.png" alt="Instagram"></button>
                            <button><img src="images/wsp-png.png" alt="WhatsApp"></button>
                            <button><img src="images/x-png.png" alt="X"></button>
                        </div>
                    `;

                    const wrapper = document.createElement('div');
                    wrapper.className = 'contacto-dropdown';
                    
                    contactoLink.parentNode.insertBefore(wrapper, contactoLink);
                    wrapper.appendChild(contactoLink);
                    wrapper.appendChild(dropdownContent);

                    wrapper.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        document.querySelector('.registro .dropdown-content')?.classList.remove('show');
                        dropdownContent.classList.toggle('show');
                    });

                    dropdownContent.querySelectorAll('.social-buttons button').forEach(button => {
                        button.addEventListener('click', (event) => {
                            event.stopPropagation();
                            alert('Muchas gracias!! Pronto nos pondremos en contacto contigo.');
                            dropdownContent.classList.remove('show');
                        });
                    });
                }
            })
            .then(() => {
                actualizarHeaderSegunEstadoLogin();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                marcadorHeader.innerHTML = `
                    <header>
                        <div class="titulo-header">
                            <span><a href="index.html">Mil Sabores</a></span>
                        </div>
                    </header>
                `;
            });
    }
}

window.addEventListener('click', (event) => {
    //cerrar con click afuera
    if (!event.target.closest('.contacto-dropdown')) {
        document.querySelector('.contacto-dropdown-content')?.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', cargarHeader);
