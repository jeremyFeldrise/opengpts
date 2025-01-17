import { use } from 'marked';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function AuthCallback() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()


    let { search } = useLocation()
    let params = new URLSearchParams(search)
    console.log(params.get('jwt_token'))

    useEffect(() => {
        if (params.get('jwt_token')) {
            localStorage.setItem('token', params.get('jwt_token'))
            setIsLoggedIn(true)
        }
    }, [params.get('jwt_token')])

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/project')
        }
    }, [isLoggedIn, navigate])

    return (
        <div>
            Test
        </div>
    )
}

export default AuthCallback