'use client'

import { useQuery } from 'react-query'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { getProjects, selectProject, deleteProject } from '../api/projects'
import { useNavigate } from 'react-router-dom'
import AddProjectCard from './AddProjectCard'
import { Button } from './button'
import { Trash, FolderOpen } from 'lucide-react'
import { useConfigList } from '../hooks/useConfigList'
import ProjectCard from './ProjectCard'

interface Project {
    project_id: string
    name: string
    description: string
}



export default function ProjectList() {
    const { data: projects, isLoading, isError, refetch } = useQuery<Project[]>('projects', getProjects)
    const { configs } = useConfigList();

    const navigate = useNavigate();

    async function chooseProject(projectId: string, projectName: string) {
        await selectProject(projectId, projectName);
        const firstAssistant = configs?.[0]?.assistant_id ?? null;
        navigate(firstAssistant ? `/assistant/${firstAssistant}` : "/app");
        window.scrollTo({ top: 0 });
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
    return (
        <>
            <AddProjectCard props={refetch} />
            {projects?.map((project) => (
                <ProjectCard key={project.project_id} project={project} chooseProject={chooseProject} handleDelete={handleDelete} refetch={refetch} />
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