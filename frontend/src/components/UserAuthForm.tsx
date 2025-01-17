'use client'

import { useEffect, useState } from 'react'
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { useQuery } from 'react-query'
import { loginUser } from '../api/auth'
import { useNavigate } from "react-router-dom"
import { ArrowRight, Mail } from 'lucide-react'
import { Header } from './Header' // Assuming you have a Header component

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [email2, setEmail2] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [betaResponse, setBetaResponse] = useState<string | null>(null)
    const navigate = useNavigate()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['loginStatus', email, password],
        queryFn: () => loginUser(email, password),
        enabled: false,
        onSuccess: (data) => {
            if (data?.jwt_token) {
                localStorage.setItem('token', data.jwt_token)
                setIsLoggedIn(true)
                console.log('Logged in successfully!')

            }
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await refetch()
    }

    const handleGoogleSignIn = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google/login`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })
            // console.log('Google Sign In response:', await response.json())
            // window.location.href = (await response.json()).url
            window.location.href = await response.json()
        } catch (error) {
            console.error('Failed to sign in with Google');
            return null;
        }
        console.log('Google Sign In successful!')
    }

    const handleBetaSignup = async () => {
        try {
            const response = await fetch('https://hook.eu2.make.com/dx9hm8fbhl74f1ezo123sc03h5de7j62', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email2 }),
            })

            if (!response.ok) {
                throw new Error('Failed to register. Please try again later.')
            }

            const responseText = await response.text()
            console.log('Webhook response:', responseText)
            setBetaResponse('Thank you for signing up! We have received your email.')
        } catch (error) {
            console.error('Error sending email to webhook:', error)
            setBetaResponse('Failed to register. Please try again later.')
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token && token !== 'undefined') {
            setIsLoggedIn(true)
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/project')
        }
    }, [isLoggedIn, navigate])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (data?.isLoggedIn) {
        return <div>You are already logged in!</div>
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header Component */}
            <Header />

            {/* Login Form */}
            <div className="flex items-center justify-center flex-grow p-4">
                <Card className="w-full max-w-4xl m-auto overflow-hidden shadow-xl rounded-xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-8">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="Enter your email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            placeholder="Enter your password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <Button className="w-full" type="submit">
                                        Sign In
                                    </Button>
                                </form>
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleGoogleSignIn}
                                        aria-label="Sign in with Google"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                            <path fill="none" d="M1 1h22v22H1z" />
                                        </svg>
                                        Sign in with Google
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </CardFooter>
                        </div>
                        <div className="flex-1 p-8 text-white bg-gradient-to-br from-blue-500 to-purple-600">
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="text-2xl font-bold">Join Our Beta</h2>
                                    <p className="mt-2">Be among the first to experience our revolutionary AI agent platform.</p>
                                </div>
                                <div className="mt-8">
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email2}
                                            onChange={(e) => setEmail2(e.target.value)}
                                            className="w-full px-4 py-2 text-white rounded-full bg-white/20 placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                        <Button
                                            size="sm"
                                            className="absolute text-blue-600 -translate-y-1/2 bg-white rounded-full right-1 top-1/2 hover:bg-blue-50"
                                            onClick={handleBetaSignup}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="mt-2 text-sm">
                                        <Mail className="inline-block w-4 h-4 mr-1" />
                                        We'll send you a link to register !
                                    </p>
                                    {betaResponse && (
                                        <p className="mt-2 text-sm text-yellow-300">{betaResponse}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
