'use client'

// retains information between renderings
import { useState } from "react"

// client talks to the db
import { createClient } from "@/lib/supabase"

// allows for redirection without needing to click a link
import { useRouter } from "next/navigation" 

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        setLoading(true)
        setError('') // clear an error if there was one

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (loginError) {
            setError(loginError.message)
            setLoading(false)
            return
        }

        router.push('/home')
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl mb-4">Login</h1>
            <div className="w-full max-w-sm flex flex-col gap-4 text-center">
               
                {error && (
                <p className="text-red-500 text-sm">{error}</p>
                )}

                <input type="text" name="loginUsername" id="loginUsername" 
                className="border rounded-2xl p-3"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                
                <input type="password" name="loginPassword" id="loginPassword" 
                className="border rounded-2xl p-3"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />

                <button
                onClick={handleLogin}
                disabled={loading}
                className="border rounded-2xl p-3 hover:bg-blue-600"
                > {loading ? "Logging in... " : "Submit"}
                </button>
            </div>
        </main>
    )

}