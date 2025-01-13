import { CheckCircle } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'
import { Link } from 'react-router-dom'

export default function SuccessfulPayment() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-green-600">Payment Successful</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                <p className="text-center text-gray-600">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild>
                    <Link to="/">Return to Dashboard</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

