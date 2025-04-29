    // Gestiona la configuración y conexión con las APIs

    class ApiManager {
        constructor() {
            this.apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:8080/api';
            this.apiConnected = false;
        }

        // Obtener la URL actual
        getApiUrl() {
            return this.apiUrl;
        }

        // Cambiar la URL de la API
        setApiUrl(url) {
            this.apiUrl = url;
            localStorage.setItem('apiUrl', url);
        }

        // Comprobar conexión con la API
        async checkConnection() {
            try {
                const response = await fetch(`${this.apiUrl}`);
                this.apiConnected = response.ok;
                return this.apiConnected;
            } catch (error) {
                this.apiConnected = false;
                return false;
            }
        }

        // CRUD operations
        async getUsers() {
            const response = await fetch(`${this.apiUrl}/users`);
            if (!response.ok) throw new Error('Error al obtener usuarios');
            const data = await response.json();
            return data.users || [];
        }

        async createUser(userData) {
            const response = await fetch(`${this.apiUrl}/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Error al crear usuario');
            return await response.json();
        }

        async updateUser(userId, userData) {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Error al actualizar usuario');
            return await response.json();
        }

        async deleteUser(userId) {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar usuario');
            return true;
        }
    }

    // Exportar una instancia singleton
    export const apiManager = new ApiManager();