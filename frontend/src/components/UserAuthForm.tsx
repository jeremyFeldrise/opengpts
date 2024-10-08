'use client'

import { useEffect, useState } from 'react'

import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { useQuery } from 'react-query'
import { loginUser } from '../api/auth'
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from 'lucide-react'



export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [email2, setEmail2] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();



    const { data, isLoading, refetch } = useQuery({
        queryKey: ['loginStatus', email, password],
        queryFn: () => loginUser(email, password),
        enabled: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would make an API call to log in here
        // Refetch the login status after attempted login
        await refetch()
    }

    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
        navigate('/project')
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (data?.isLoggedIn) {
        return <div>You are already logged in!</div>
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Card className="w-full max-w-4xl m-auto overflow-hidden shadow-xl rounded-xl">
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-8">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="Enter your email" type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" placeholder="Enter your password" type="password" required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full" type="submit" onClick={handleSubmit}>
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
                                <p className="mt-2">Be among the first to experience our revolutionary AI chat agent platform.</p>
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
                                        onClick={() => {
                                            // Handle beta registration
                                            console.log('Beta registration:', email)
                                        }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="mt-2 text-sm">
                                    <Mail className="inline-block w-4 h-4 mr-1" />
                                    We'll notify you when we're ready!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}