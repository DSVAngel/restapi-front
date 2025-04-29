import { apiManager } from './api.js';
import { fetchUsers, createUser, updateUser, deleteUser } from './users.js';

// Variables globales para usuarios
let users = [];

// Mostrar notificación
export function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Renderizar tabla de usuarios
export function renderUsers(usersData) {
    users = usersData;
    const usersTbody = document.getElementById('users-tbody');
    
    if (users.length === 0) {
        usersTbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;">No hay usuarios registrados</td>
            </tr>
        `;
        return;
    }
    
    usersTbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.age || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-warning edit-btn" data-id="${user.id}">Editar</button>
                    <button class="btn-danger delete-btn" data-id="${user.id}">Eliminar</button>
                </div>
            </td>
        `;
        usersTbody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(btn.getAttribute('data-id')));
    });
}

// Abrir modal de edición
function openEditModal(userId) {
    const user = users.find(u => u.id == userId);
    if (!user) return;
    
    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-name').value = user.name || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-age').value = user.age || '';
    document.getElementById('edit-comments').value = user.comments || '';
    
    document.getElementById('edit-modal').style.display = 'flex';
}

// Abrir modal de eliminación
function openDeleteModal(userId) {
    document.getElementById('delete-id').value = userId;
    document.getElementById('delete-modal').style.display = 'flex';
}

// Configurar API
export function updateApiStatus() {
    const apiStatusDot = document.getElementById('api-status-dot');
    const apiStatusText = document.getElementById('api-status-text');
    const isConnected = apiManager.apiConnected;
    
    apiStatusDot.className = isConnected ? 'status-dot connected' : 'status-dot disconnected';
    apiStatusText.textContent = isConnected ? 'Conectado' : 'Desconectado';
}

// Actualizar el botón de API activo
export function updateActiveApiButton() {
    const currentApiUrl = apiManager.getApiUrl();
    const apiButtons = document.querySelectorAll('.api-preset');
    
    apiButtons.forEach(btn => {
        if (btn.getAttribute('data-url') === currentApiUrl) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Inicializar UI y configurar eventos
export function initUI() {
    // Elementos DOM
    const apiUrlInput = document.getElementById('api-url');
    const saveApiBtn = document.getElementById('save-api');
    const refreshUsersBtn = document.getElementById('refresh-users');
    const createUserForm = document.getElementById('create-user-form');
    const editUserForm = document.getElementById('edit-user-form');
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const closeDeleteModal = document.getElementById('close-delete-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const apiLocalBtn = document.getElementById('api-local');
    const apiProdBtn = document.getElementById('api-prod');

    // Configurar la URL inicial
    apiUrlInput.value = apiManager.getApiUrl();
    updateActiveApiButton();
    
    // Botones de API preestablecidos
    apiLocalBtn.addEventListener('click', () => {
        apiUrlInput.value = apiLocalBtn.getAttribute('data-url');
        saveApiConfig();
    });
    
    apiProdBtn.addEventListener('click', () => {
        apiUrlInput.value = apiProdBtn.getAttribute('data-url');
        saveApiConfig();
    });
    
    // Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Actualizar tabs activos
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Actualizar contenido de tab activo
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Guardar configuración de API
    saveApiBtn.addEventListener('click', saveApiConfig);

    // Refrescar lista de usuarios
    refreshUsersBtn.addEventListener('click', fetchUsers);

    // Crear usuario
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value || null,
            comments: document.getElementById('comments').value || null
        };
        
        createUser(userData).then(success => {
            if (success) {
                createUserForm.reset();
                fetchUsers();
                tabs[0].click(); // Cambiar a la pestaña de lista
            }
        });
    });

    // Editar usuario
    editUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('edit-id').value;
        const userData = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            age: document.getElementById('edit-age').value || null,
            comments: document.getElementById('edit-comments').value || null
        };
        
        updateUser(userId, userData).then(success => {
            if (success) {
                editModal.style.display = 'none';
                fetchUsers();
            }
        });
    });

    // Modal de edición
    closeEditModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Modal de eliminación
    closeDeleteModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    
    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    
    confirmDelete.addEventListener('click', () => {
        const userId = document.getElementById('delete-id').value;
        deleteUser(userId).then(success => {
            if (success) {
                deleteModal.style.display = 'none';
                fetchUsers();
            }
        });
    });
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
}

function saveApiConfig() {
    const apiUrlInput = document.getElementById('api-url');
    const apiUrl = apiUrlInput.value.trim();
    
    if (!apiUrl) {
        showNotification('La URL de la API no puede estar vacía', 'error');
        return;
    }
    
    apiManager.setApiUrl(apiUrl);
    showNotification('Configuración de API guardada correctamente', 'success');
    
    // Actualizar botón activo
    updateActiveApiButton();
    
    // Recargar usuarios con la nueva API
    fetchUsers();
}