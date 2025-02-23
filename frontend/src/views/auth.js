import supabase from '../supabase-client.js'
import { useState } from 'react'
import '../styles/auth.css'

function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            alert('Check your email for the confirmation')
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const { data, error } = await supabase.auth.signInWithPassword({
                email, 
                password,
            })

            if (error) throw error

        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false) 
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <form className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {isSignUp ? (
                        <button 
                            className="auth-button" 
                            onClick={handleSignUp} 
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    ) : (
                        <button 
                            className="auth-button" 
                            onClick={handleSignIn} 
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    )}
                    <p className="auth-switch">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button 
                            type="button"
                            className="switch-button"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Auth