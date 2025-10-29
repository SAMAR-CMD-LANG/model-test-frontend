'use client'

import { useState, useEffect } from 'react'
import { getStoredToken } from '../../lib/api'

export default function DebugPage() {
    const [debugInfo, setDebugInfo] = useState(null)
    const [authInfo, setAuthInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkDebugInfo = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

                // Check health endpoint
                const healthResponse = await fetch(`${apiUrl}/health`)
                const healthData = await healthResponse.json()

                // Check debug auth endpoint
                const token = getStoredToken()
                const authResponse = await fetch(`${apiUrl}/debug/auth`, {
                    credentials: 'include',
                    headers: {
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                })
                const authData = await authResponse.json()

                setDebugInfo(healthData)
                setAuthInfo(authData)
            } catch (error) {
                console.error('Debug check failed:', error)
                setDebugInfo({ error: error.message })
            } finally {
                setLoading(false)
            }
        }

        checkDebugInfo()
    }, [])

    if (loading) {
        return <div className="p-8">Loading debug info...</div>
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Debug Information</h1>

            <div className="grid gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Frontend Info</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify({
                            apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
                            storedToken: getStoredToken() ? 'Present' : 'Missing',
                            hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
                            origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
                        }, null, 2)}
                    </pre>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Backend Health</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Auth Debug</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(authInfo, null, 2)}
                    </pre>
                </div>
            </div>

            <div className="mt-6">
                <a href="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </a>
            </div>
        </div>
    )
}