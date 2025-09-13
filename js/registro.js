function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function esCorreoDuoc(correo) {
    return correo.endsWith('@duocuc.cl');
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function registrarUsuario({ nombre, correo, fechaNacimiento, contrasena, codigoRegistro }) {
    const usuarios = obtenerUsuarios();
    // Verifica si el correo ya está registrado
    if (usuarios.some(u => u.correo === correo)) {
        alert('El correo ya está registrado.');
        return false;
    }

    const edad = calcularEdad(fechaNacimiento);
    let descuentos = [];
    let beneficios = [];

    if (edad >= 50) {
        descuentos.push({ tipo: 'Edad', porcentaje: 50 });
    }
    if (codigoRegistro && codigoRegistro === 'FELICES50') {
        descuentos.push({ tipo: 'Código FELICES50', porcentaje: 10 });
    }
    if (esCorreoDuoc(correo)) {
        beneficios.push('Torta gratis en tu cumpleaños');
    }

    const usuario = {
        nombre,
        correo,
        fechaNacimiento,
        edad,
        contrasena,
        descuentos,
        beneficios
    };
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    return true;
}

document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('name').value;
    const correo = document.getElementById('email').value;
    const fechaNacimiento = document.getElementById('dob').value;
    const contrasena = document.getElementById('password').value;
    const confirmarContrasena = document.getElementById('confirm-password').value;
    const codigoRegistro = document.getElementById('coupon').value;

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const exito = registrarUsuario({ nombre, correo, fechaNacimiento, contrasena, codigoRegistro });
    if (exito) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
    }
});