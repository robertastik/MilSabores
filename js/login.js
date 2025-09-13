function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function iniciarSesion(correo, contrasena) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

    if (usuario) {
        mostrarMensaje('Sesión iniciada con éxito');
        window.location.href = 'index.html';    
        return true;
    } else {
        mostrarMensaje('Error: email o contraseña incorrectos');
        return false;
    }
}

function mostrarMensaje(mensaje) {
    alert(mensaje); 
}

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;
    iniciarSesion(correo, contrasena);
});