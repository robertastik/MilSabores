document.addEventListener('DOMContentLoaded', () => {
   
    function obtenerUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios') || '[]');
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function obtenerUsuarioActual() {
        const currentUserEmail = localStorage.getItem('currentUser');
        if (!currentUserEmail) return null;

        const usuarios = obtenerUsuarios();
        return usuarios.find(u => u.correo === currentUserEmail);
    }

    function guardarUsuarioActual(usuarioActualizado) {
        const usuarios = obtenerUsuarios();
        const userIndex = usuarios.findIndex(u => u.correo === usuarioActualizado.correo);
        if (userIndex !== -1) {
            usuarios[userIndex] = usuarioActualizado;
            guardarUsuarios(usuarios);
            return true;
        }
        return false;
    }

    let usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) {
        alert('Debes iniciar sesión para ver tu perfil.');
        window.location.href = 'login.html';
        return;
    }


    if (!usuarioActual.preferencias || !Array.isArray(usuarioActual.preferencias)) {
        usuarioActual.preferencias = [];
    }

    const perfilForm = document.getElementById('perfil-form');
    const nombreInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const fechanacimiento = document.getElementById('dob');
    const passwordInput = document.getElementById('password');
    const listaPreferencias = document.getElementById('lista-preferencias');
    const agregarPreferenciaForm = document.getElementById('agregar-preferencia-form');
    const nuevaPreferenciaInput = document.getElementById('nueva-preferencia');

    
    function popularDatosPerfil() {
        if (!usuarioActual) return;
        nombreInput.value = usuarioActual.nombre;
        emailInput.value = usuarioActual.correo;
        fechanacimiento.value = usuarioActual.fechaNacimiento;
        renderizarPreferencias();
    }

    function renderizarPreferencias() {
        listaPreferencias.innerHTML = '';
        if (usuarioActual.preferencias && usuarioActual.preferencias.length > 0) {
            usuarioActual.preferencias.forEach((pref, index) => {
                const li = document.createElement('li');
                
                const span = document.createElement('span');
                span.textContent = pref;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn-eliminar-pref';
                deleteButton.dataset.index = index;
                deleteButton.innerHTML = '×';

                li.appendChild(span);
                li.appendChild(deleteButton);
                listaPreferencias.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No tienes preferencias guardadas.';
            li.style.justifyContent = 'center';
            listaPreferencias.appendChild(li);
        }
    }

   
    function handleUpdateProfile(e) {
        e.preventDefault();

    usuarioActual.nombre = nombreInput.value;
    usuarioActual.fechaNacimiento = fechanacimiento.value;
        
        const nuevaContrasena = passwordInput.value;
        if (nuevaContrasena) {
            usuarioActual.contrasena = nuevaContrasena;
        }

        if (guardarUsuarioActual(usuarioActual)) {
            alert('Perfil actualizado con éxito.');
            passwordInput.value = ''; 
        } else {
            alert('Error al actualizar el perfil.');
        }
    }

    function handleAddPreference(e) {
        e.preventDefault();
        const nuevaPreferencia = nuevaPreferenciaInput.value.trim();

        if (nuevaPreferencia) {
            usuarioActual.preferencias.push(nuevaPreferencia);
            if (guardarUsuarioActual(usuarioActual)) {
                renderizarPreferencias();
                nuevaPreferenciaInput.value = '';
            } else {
                usuarioActual.preferencias.pop(); // Rollback
                alert('Error al guardar la preferencia.');
            }
        }
    }

    function handleDeletePreference(e) {
        if (e.target.classList.contains('btn-eliminar-pref')) {
            const index = parseInt(e.target.dataset.index, 10);
            usuarioActual.preferencias.splice(index, 1);
            if (!guardarUsuarioActual(usuarioActual)) {
                alert('Error al eliminar la preferencia.');
                usuarioActual = obtenerUsuarioActual(); 
            }
            renderizarPreferencias();
        }
    }

    
    perfilForm.addEventListener('submit', handleUpdateProfile);
    agregarPreferenciaForm.addEventListener('submit', handleAddPreference);
    listaPreferencias.addEventListener('click', handleDeletePreference);

    
    popularDatosPerfil();
});