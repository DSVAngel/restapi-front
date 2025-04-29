import { apiManager } from './api.js';
import { showNotification, renderUsers } from './ui.js';

export async function fetchUsers() {
    const usersLoader = document.getElementById('users-loader');
    const usersTbody = document.getElementById('users-tbody');
    
    usersLoader.style.display = 'block';
    usersTbody.innerHTML = '';
    
    try {
        const connected = await apiManager.checkConnection();
        if (!connected) {
            showNotification('No se pudo conectar a la API', 'error');
            usersLoader.style.display = 'none';
            usersTbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No se pudo conectar a la API</td>
                </tr>
            `;
            return;
        }
        

        const users = await apiManager.getUsers();
        renderUsers(users);
        showNotification('Usuarios cargados correctamente', 'success');
        return users;
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        usersTbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;">Error al cargar usuarios</td>
            </tr>
        `;
        return [];
    } finally {
        usersLoader.style.display = 'none';
    }
}

// Crear un nuevo usuario
export async function createUser(userData) {
    try {
        await apiManager.createUser(userData);
        showNotification('Usuario creado correctamente', 'success');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        return false;
    }
}

// Actualizar usuario
export async function updateUser(userId, userData) {
    try {
        await apiManager.updateUser(userId, userData);
        showNotification('Usuario actualizado correctamente', 'success');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        return false;
    }
}

// Eliminar usuario
export async function deleteUser(userId) {
    try {
        await apiManager.deleteUser(userId);
        showNotification('Usuario eliminado correctamente', 'success');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        return false;
    }
}