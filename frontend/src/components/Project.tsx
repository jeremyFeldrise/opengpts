'use client'


import ProjectList from './ProjectList'
import AddProjectCard from './AddProjectCard'


export default function Project() {
    return (
        <div className="container p-4 mx-auto">
            <h1 className="mb-4 text-2xl font-bold">Projects</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AddProjectCard />
                <ProjectList />
            </div>
        </div>
    )
}