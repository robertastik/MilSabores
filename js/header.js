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
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = `
                    <style>
                    @font-face {
                      font-family: Lato-Regular;
                      src: url('/font/Lato-Regular.ttf') format('truetype');
                      font-weight: 400;
                      font-display: swap;
                    }
                    @font-face {
                      font-family: Pacifico-Regular;
                      src: url('/font/Pacifico-Regular.ttf') format('truetype');
                      font-weight: 400;
                      font-display: swap;
                    }
                    header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 1rem 1.5rem;
                      font-family: 'Lato-Regular';
                      background-color: #FFC0CB;
                    }
                    .titulo-header span {
                      font-size: 3rem;
                      font-family: 'Pacifico-Regular' !important;
                    }
                    .titulo-header a {
                      text-decoration: none;
                      color: #5D4037;
                    }
                    .registro a {
                      margin-right: 1.5rem;
                      cursor: pointer;
                      font-size: 16px;
                      text-decoration: none;
                      color: #5D4037;
                    }
                    .registro a:hover {
                      text-decoration: underline;
                    }
                    </style>
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
