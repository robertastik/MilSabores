function updateHeaderBasedOnLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const registroDiv = document.querySelector('.registro');
 
    if (isLoggedIn) {
        registroDiv.innerHTML = `
            <div class="dropdown">
                <span class="user-icon"><img src="images/user (1).svg" alt="User Icon"></span>
                <div class="dropdown-content" id="dropdown-content">
                    <a href="perfil.html">Perfil</a>
                    <a href="#" id="cerrar-sesion">Cerrar Sesión</a>
                </div>
            </div>
        `;
 
        const cerrarSesionLink = document.getElementById('cerrar-sesion');
        if (cerrarSesionLink) {
            cerrarSesionLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    }
    
    const userIcon = document.querySelector('.user-icon');
    const dropdownContent = document.querySelector('.registro .dropdown-content');
 
    if (userIcon && dropdownContent) {
        userIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
 
        window.addEventListener('click', (event) => {
            
            if (!userIcon.contains(event.target)) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    }
}

function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');

    if (headerPlaceholder) {
        fetch('components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                headerPlaceholder.innerHTML = html;

                const hamburgerMenu = document.querySelector('.hamburger-menu');
                const navegacionHeader = document.querySelector('.navegacion-header');

                if (hamburgerMenu && navegacionHeader) {
                    hamburgerMenu.addEventListener('click', () => {
                        navegacionHeader.classList.toggle('show');
                    });
                }
            })
            .then(() => {
                updateHeaderBasedOnLoginStatus();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = `
                    <header>
                        <div class="titulo-header">
                            <span><a href="index.html">Mil Sabores</a></span>
                        </div>
                    </header>
                `;
            });
    }
}



document.addEventListener('DOMContentLoaded', loadHeader);
