import SuccessfulPayment from './SuccessfulPayment'
import CanceledPayment from './CanceledPayment'
import { useParams } from 'react-router-dom'

export default function PaymentResultPage() {
    const { status } = useParams()
    console.log(status)
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {status === 'success' ? <SuccessfulPayment /> : <CanceledPayment />}
        </div>
    )
}