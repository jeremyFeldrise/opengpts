'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { addProject } from '../api/projects'
import { useMutation } from 'react-query'

export default function AddProjectCard(refetch: any) {
    const [isAdding, setIsAdding] = useState(false)
    const mutation = useMutation({
        mutationFn: ({ name, description }: { name: string, description: string }) => addProject(name, description),
        onSuccess: () => {
            setIsAdding(false)
            refetch.props()
        }
    })


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        mutation.mutate({
            name: (event.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
            description: (event.currentTarget.elements.namedItem('description') as HTMLInputElement).value
        })



        setIsAdding(false)
    }

    if (!isAdding) {
        return (
            <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setIsAdding(true)}>
                <CardContent className="flex items-center justify-center h-full">
                    <Button variant="outline">+ Add New Project</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Project Name</Label>
                        <Input id="name" placeholder="Enter project name" required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Enter project description" required />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit">Add Project</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}