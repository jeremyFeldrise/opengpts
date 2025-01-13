import { XCircle } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'
import { Link } from 'react-router-dom'

export default function CanceledPayment() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-red-600">Payment Canceled</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <XCircle className="w-16 h-16 mb-4 text-red-500" />
                <p className="text-center text-gray-600">
                    Your payment has been canceled. If you have any questions, please contact our support team.
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild>
                    <Link to="/">Try Again</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}


