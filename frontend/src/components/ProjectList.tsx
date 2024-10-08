'use client'

import { useQuery } from 'react-query'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { getProjects, selectProject, deleteProject } from '../api/projects'
import { useNavigate } from 'react-router-dom'
import AddProjectCard from './AddProjectCard'
import { Button } from './button'
import { Trash } from 'lucide-react'

interface Project {
    project_id: string
    name: string
    description: string
}



export default function ProjectList() {
    const { data: projects, isLoading, isError, refetch } = useQuery<Project[]>('projects', getProjects)
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

    async function handleDelete(projectId: string) {
        await deleteProject(projectId);
    }
    console.log('Projects', projects)
    return (
        <>
            <AddProjectCard props={refetch} />
            {projects?.map((project) => (
                <Card key={project.project_id} onClick={() => chooseProject(project.project_id)}>
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent >
                        <p>{project.description}</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            onClick={async (e) => {
                                console.log('Delete project', project.project_id)
                                e.stopPropagation();
                                await handleDelete(project.project_id);
                                refetch();
                            }}
                        >
                            <Trash size={16} />
                            Delete
                        </Button>
                    </CardFooter>
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