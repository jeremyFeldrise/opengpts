'use client'

import { useState } from 'react'
import { Coins } from 'lucide-react'
import { Button } from "./button"
import { Input } from "./input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Label } from "./label"
import { Slider } from "./slider"

export default function DigitalTokenPurchase() {
    const [tokenCount, setTokenCount] = useState(100)
    const [error, setError] = useState('')

    const tokenPrice = 0.1 // Price per token in dollars
    const totalPrice = tokenCount * tokenPrice

    const handleTokenChange = (value: number[]) => {
        const newValue = value[0]
        if (newValue >= 100 && newValue <= 1000) {
            setTokenCount(newValue)
            setError('')
        } else {
            setError('Please select between 100 and 1000 tokens')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value)
        if (!isNaN(newValue)) {
            if (newValue >= 100 && newValue <= 1000) {
                setTokenCount(newValue)
                setError('')
            } else {
                setError('Please enter a number between 100 and 1000')
            }
        } else {
            setError('Please enter a valid number')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle the purchase process
        //
        // Make a post request to the backend to purchase the tokens
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkout/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                quantity: tokenCount
            })
        })
        const data = await response.json()
        console.log(data)
        window.location.href = data.url
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Purchase Digital Tokens</CardTitle>
                    <CardDescription>Select the number of tokens you want to buy (100-1000)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="token-count">Number of Tokens</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="token-count"
                                        type="number"
                                        value={tokenCount}
                                        onChange={handleInputChange}
                                        min={100}
                                        max={1000}
                                        className="w-24"
                                    />
                                    <Slider
                                        value={[tokenCount]}
                                        onValueChange={handleTokenChange}
                                        min={100}
                                        max={1000}
                                        step={1}
                                        className="flex-grow"
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
                                <Coins className="w-8 h-8 text-yellow-500" />
                                <span>{tokenCount}</span>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">({tokenPrice.toFixed(2)} per token)</p>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={handleSubmit}>
                        Purchase Tokens
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

