import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { Button } from './button'
import { Trash, FolderOpen, Pencil, ChevronRight } from 'lucide-react'
import { updateProject } from '../api/projects'
import { useMutation } from 'react-query'

interface Project {
  project_id: string
  name: string
  description: string
}

function ProjectCard({ project, chooseProject, handleDelete, refetch }: { project: Project, chooseProject: (projectId: string, projectName: string) => void, handleDelete: (projectId: string) => void, refetch: any }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(project.name);
  const [editedDescription, setEditedDescription] = React.useState(project.description);


  const mutation = useMutation({
    mutationFn: ({ name, description }: { name: string, description: string }) => updateProject(project.project_id, name, description),
    onSuccess: () => {
      setIsEditing(false)
      refetch();
    }
  })

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </CardHeader>
        <CardContent>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          <Button onClick={async () => {
            // Add your update logic here
            console.log("Refetch")
            mutation.mutate({ name: editedName, description: editedDescription });
            setIsEditing(false);
            refetch();
          }}>Save</Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card key={project.project_id} onClick={() => chooseProject(project.project_id, project.name)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{project.name}</CardTitle>
          <Button size="icon" variant="ghost" onClick={() => chooseProject(project.project_id, project.name)}><ChevronRight size={24} className="text-blue-400" /></Button>
        </div>
      </CardHeader>
      <CardContent >
        <p>{project.description}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button rightElem={<Pencil />} variant="outline" onClick={async (e) => {
          e.stopPropagation();
          setIsEditing(!isEditing);
        }
        }>Edit</Button>
        <Button
          variant="waring"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(project.project_id);
            refetch();
          }}
          rightElem={<Trash size={16} />}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
