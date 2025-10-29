import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata = {
  title: 'Note.io - Professional Note Taking',
  description: 'Secure, encrypted note-taking application with advanced features',
  keywords: 'notes, productivity, encryption, secure, professional',
  authors: [{ name: 'Note.io Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div id="root">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: 'var(--text-inverse)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'var(--text-inverse)',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}