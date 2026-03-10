'use client'

// retains information between renderings
import { useState } from "react"

// client talks to the db
import { createClient } from "@/lib/supabase"

// allows for redirection without needing to click a link
import { useRouter } from "next/navigation" 

// the main idea here is using supabase + created table to be able 
// to have a register + create profile 
export default function SignupPage() {
    
    const supabase = createClient()
    const router = useRouter()

    // tracking user entries in fields 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    // tracking the UI state 
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSignup() {
        console.log('signup clicked', { email, password, username })
        setLoading(true) // loading state displayed
        setError('') // clearing an existing error 

        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        })

        console.log('signup result', { data, error: signupError })

        if (signupError) {
            setError(signupError.message)
            setLoading(false)
            return
        }

        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    username
                })
            if (profileError) {
                setError(profileError.message)
                setLoading(false)
                return
            }
        }

        router.push('/home')
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold text-center">Sign up for this thing</h1>
            <p className="text-center mb-8">I'll name it eventually</p>
            <div className="w-full max-w-sm flex flex-col gap-4 text-center">

                {error && (
                <p className="text-red-500 text-sm">{error}</p>
                )}
                
                <input type="text" name="regUsername" id="regUsername"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="border rounded-2xl p-3"
                /> 
                <input type="email" name="regEmail" id="regEmail" 
                placeholder="email"
                className="border rounded-2xl p-3"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <input type="password" name="regPassword" id="regPassword"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border rounded-2xl p-3"
                />

                <button
                onClick={handleSignup}
                disabled={loading}
                className="border rounded-2xl p-3 hover:bg-blue-600"
                > {loading ? "Creating account... " : "Submit"}
                </button>

                <p className="">If you already have an account click <a href="/login" className=" hover:text-blue-500">here</a>
                    </p>
            </div>
        </main>
    )

}