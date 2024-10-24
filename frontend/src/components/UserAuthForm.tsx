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
            if (data?.token) {
                localStorage.setItem('token', data.token)
                setIsLoggedIn(true)
            }
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await refetch()
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
            <div className="flex-grow flex items-center justify-center p-4">
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
