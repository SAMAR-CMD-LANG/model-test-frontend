// API Configuration and Utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// API request wrapper with error handling
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultOptions = {
        credentials: 'include', // Always include cookies for auth
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    }

    const config = {
        ...defaultOptions,
        ...options,
    }

    try {
        const response = await fetch(url, config)

        // Handle different response types
        const contentType = response.headers.get('content-type')
        let data

        if (contentType && contentType.includes('application/json')) {
            data = await response.json()
        } else {
            data = await response.text()
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return { data, response }
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error)
        throw error
    }
}

// Auth API endpoints
export const authAPI = {
    // Register new user
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
    },

    // Login user
    login: async (credentials) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    },

    // Logout user
    logout: async () => {
        return apiRequest('/auth/logout', {
            method: 'POST',
        })
    },

    // Get current user
    me: async () => {
        return apiRequest('/auth/me')
    },

    // Forgot password
    forgotPassword: async (email) => {
        return apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        return apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        })
    },

    // Google OAuth URL
    googleAuth: () => `${API_BASE_URL}/auth/google`,
}

// Notes API endpoints
export const notesAPI = {
    // Get all notes with filters
    getNotes: async (params = {}) => {
        const searchParams = new URLSearchParams(params)
        return apiRequest(`/notes?${searchParams}`)
    },

    // Get single note
    getNote: async (id) => {
        return apiRequest(`/notes/${id}`)
    },

    // Create new note
    createNote: async (noteData) => {
        return apiRequest('/notes', {
            method: 'POST',
            body: JSON.stringify(noteData),
        })
    },

    // Update note
    updateNote: async (id, noteData) => {
        return apiRequest(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(noteData),
        })
    },

    // Delete note
    deleteNote: async (id) => {
        return apiRequest(`/notes/${id}`, {
            method: 'DELETE',
        })
    },

    // Auto-save note
    autoSaveNote: async (id, noteData) => {
        return apiRequest(`/notes/${id}/autosave`, {
            method: 'POST',
            body: JSON.stringify(noteData),
        })
    },

    // Get public notes
    getPublicNotes: async (params = {}) => {
        const searchParams = new URLSearchParams(params)
        return apiRequest(`/notes/public?${searchParams}`)
    },
}

// User API endpoints
export const userAPI = {
    // Get user statistics
    getStats: async () => {
        return apiRequest('/stats')
    },

    // Get feature status
    getFeatures: async () => {
        return apiRequest('/features')
    },
}

export default {
    authAPI,
    notesAPI,
    userAPI,
    apiRequest,
}