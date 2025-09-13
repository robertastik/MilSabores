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

    let currentUser = obtenerUsuarioActual();
    if (!currentUser) {
        alert('Debes iniciar sesión para ver tu perfil.');
        window.location.href = 'login.html';
        return;
    }


    if (!currentUser.preferencias || !Array.isArray(currentUser.preferencias)) {
        currentUser.preferencias = [];
    }

    const perfilForm = document.getElementById('perfil-form');
    const nombreInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const dobInput = document.getElementById('dob');
    const passwordInput = document.getElementById('password');
    const listaPreferencias = document.getElementById('lista-preferencias');
    const agregarPreferenciaForm = document.getElementById('agregar-preferencia-form');
    const nuevaPreferenciaInput = document.getElementById('nueva-preferencia');

    
    function popularDatosPerfil() {
        if (!currentUser) return;
        nombreInput.value = currentUser.nombre;
        emailInput.value = currentUser.correo;
        dobInput.value = currentUser.fechaNacimiento;
        renderizarPreferencias();
    }

    function renderizarPreferencias() {
        listaPreferencias.innerHTML = '';
        if (currentUser.preferencias && currentUser.preferencias.length > 0) {
            currentUser.preferencias.forEach((pref, index) => {
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
            li.style.justifyContent = 'center'; // Center the text
            listaPreferencias.appendChild(li);
        }
    }

   
    function handleUpdateProfile(e) {
        e.preventDefault();

        currentUser.nombre = nombreInput.value;
        currentUser.fechaNacimiento = dobInput.value;
        
        const nuevaContrasena = passwordInput.value;
        if (nuevaContrasena) {
            currentUser.contrasena = nuevaContrasena;
        }

        if (guardarUsuarioActual(currentUser)) {
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
            currentUser.preferencias.push(nuevaPreferencia);
            if (guardarUsuarioActual(currentUser)) {
                renderizarPreferencias();
                nuevaPreferenciaInput.value = '';
            } else {
                currentUser.preferencias.pop(); // Rollback
                alert('Error al guardar la preferencia.');
            }
        }
    }

    function handleDeletePreference(e) {
        if (e.target.classList.contains('btn-eliminar-pref')) {
            const index = parseInt(e.target.dataset.index, 10);
            currentUser.preferencias.splice(index, 1);
            if (!guardarUsuarioActual(currentUser)) {
                alert('Error al eliminar la preferencia.');
                currentUser = obtenerUsuarioActual(); 
            }
            renderizarPreferencias();
        }
    }

    
    perfilForm.addEventListener('submit', handleUpdateProfile);
    agregarPreferenciaForm.addEventListener('submit', handleAddPreference);
    listaPreferencias.addEventListener('click', handleDeletePreference);

    
    popularDatosPerfil();
});