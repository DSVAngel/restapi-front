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
            // Añadir un timeout para evitar esperas largas
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${this.apiUrl}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            this.apiConnected = response.ok;
            return this.apiConnected;
        } catch (error) {
            console.error("Error de conexión API:", error);
            this.apiConnected = false;
            return false;
        }
    }

    // CRUD operations con manejo de errores mejorado
    async getUsers() {
        if (!this.apiConnected) {
            await this.checkConnection();
            if (!this.apiConnected) {
                throw new Error('No hay conexión con la API');
            }
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/users`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener usuarios: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            return data.users || [];
        } catch (error) {
            console.error("Error en getUsers:", error);
            throw error;
        }
    }

    async createUser(userData) {
        if (!this.apiConnected) {
            await this.checkConnection();
            if (!this.apiConnected) {
                throw new Error('No hay conexión con la API');
            }
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear usuario: ${response.status} - ${errorText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error en createUser:", error);
            throw error;
        }
    }

    async updateUser(userId, userData) {
        if (!this.apiConnected) {
            await this.checkConnection();
            if (!this.apiConnected) {
                throw new Error('No hay conexión con la API');
            }
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar usuario: ${response.status} - ${errorText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error en updateUser:", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        if (!this.apiConnected) {
            await this.checkConnection();
            if (!this.apiConnected) {
                throw new Error('No hay conexión con la API');
            }
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al eliminar usuario: ${response.status} - ${errorText}`);
            }
            
            return true;
        } catch (error) {
            console.error("Error en deleteUser:", error);
            throw error;
        }
    }
}

// Exportar una instancia singleton
export const apiManager = new ApiManager();
