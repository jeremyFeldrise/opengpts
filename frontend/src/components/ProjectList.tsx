'use client'

import { useQuery } from 'react-query'

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { getProjects, selectProject } from '../api/projects'
import { useNavigate } from 'react-router-dom'

interface Project {
    project_id: string
    name: string
    description: string
}



export default function ProjectList() {
    const { data: projects, isLoading, isError } = useQuery<Project[]>('projects', getProjects)
    const navigate = useNavigate();

    async function chooseProject(projectId: string) {
        await selectProject(projectId);
        navigate('/app')
    }
    if (isLoading) {
        return <LoadingCard />
    }

    if (isError) {
        return <ErrorCard />
    }

    return (
        <>
            {projects?.map((project) => (
                <Card key={project.project_id} onClick={() => chooseProject(project.project_id)}>
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{project.description}</p>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

function LoadingCard() {
    return (
        <Card>
            <CardContent className="flex items-center justify-center h-32">
                <p>Loading...</p>
            </CardContent>
        </Card>
    )
}

function ErrorCard() {
    return (
        <Card>
            <CardContent className="flex items-center justify-center h-32">
                <p className="text-red-500">Error loading projects</p>
            </CardContent>
        </Card>
    )
}