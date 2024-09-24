'use client'

import { useState } from 'react'

import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { useQuery } from 'react-query'
import { loginUser } from '../api/auth'
import { useNavigate } from "react-router-dom";



export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['loginStatus', username, password],
        queryFn: () => loginUser(username, password),
        enabled: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would make an API call to log in here
        console.log('Logging in with:', username, password)
        // Refetch the login status after attempted login
        await refetch()
    }

    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
        navigate('/projects')
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (data?.isLoggedIn) {
        return <div>You are already logged in!</div>
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Log In
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                </a>
            </CardFooter>
        </Card>
    )
}