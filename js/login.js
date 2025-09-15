function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function iniciarSesion(correo, contrasena) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

    if (usuario) {
        mostrarAlerta('Sesión iniciada con éxito');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', usuario.correo);
        window.location.href = 'index.html';    
        return true;
    } else {
        mostrarAlerta('Error: email o contraseña incorrectos');
        return false;
    }
}

function mostrarAlerta(mensaje) {
    alert(mensaje); 
}

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;
    iniciarSesion(correo, contrasena);
});

window.addEventListener('load', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
});