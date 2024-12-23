'use client'


import ProjectList from './ProjectList'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from './Header'


export default function Project() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token') || localStorage.getItem('token') == 'undefined') {
            navigate('/login')
        }
    }, [navigate])

    return (
        <div className="container p-4 mx-auto">
            <Header />
            <h1 className="mb-4 text-2xl font-bold">Projects</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                
                <ProjectList />
            </div>
            
        </div>
    )
}