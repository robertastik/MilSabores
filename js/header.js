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

                // Dropdown logic
                const userIcon = document.querySelector('.user-icon');
                const dropdownContent = document.querySelector('.dropdown-content');

                if (userIcon && dropdownContent) {
                    userIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        dropdownContent.classList.toggle('show');
                    });

                    window.addEventListener('click', (event) => {
                        if (!event.target.matches('.user-icon')) {
                            if (dropdownContent.classList.contains('show')) {
                                dropdownContent.classList.remove('show');
                            }
                        }
                    });
                }

                const hamburgerMenu = document.querySelector('.hamburger-menu');
                const navegacionHeader = document.querySelector('.navegacion-header');

                if (hamburgerMenu && navegacionHeader) {
                    hamburgerMenu.addEventListener('click', () => {
                        navegacionHeader.classList.toggle('show');
                    });
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = `
                    <header>
                        <div class="titulo-header">
                            <span><a href="index.html">Mil Sabores</a></span>
                        </div>
                        <div class="registro">
                            <a href="login.html">Iniciar Sesión</a>
                            <a href="registrarse.html">Registrarse</a>
                        </div>
                    </header>
                `;
            });
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);
