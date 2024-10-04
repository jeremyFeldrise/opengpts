'use client'


import ProjectList from './ProjectList'
import AddProjectCard from './AddProjectCard'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Project() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token') || localStorage.getItem('token') == 'undefined') {
            console.log('Token', localStorage.getItem('token'))
            navigate('/login')
        }
    }, [navigate])

    return (
        <div className="container p-4 mx-auto">
            <h1 className="mb-4 text-2xl font-bold">Projects</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ProjectList />
            </div>
        </div>
    )
}