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
    
    // support both class names: original .user-icon (from component) and .icono-usuario (fallback/renamed)
    const iconoUsuario = document.querySelector('.icono-usuario') || document.querySelector('.user-icon');
    const contenidoDropdown = document.querySelector('.registro .dropdown-content');

    if (iconoUsuario && contenidoDropdown) {
        iconoUsuario.addEventListener('click', (event) => {
            event.stopPropagation();
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



document.addEventListener('DOMContentLoaded', cargarHeader);
