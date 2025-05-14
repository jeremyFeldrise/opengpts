import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { addProject } from '../api/projects'
import { useMutation } from 'react-query'
import AppLayout from './AppLayout'
import { useNavigate } from 'react-router-dom'

export default function AddProjectCard(refetch: any) {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: ({ name, description }: { name: string, description: string }) => addProject(name, description),
    onSuccess: () => {
      refetch.props()
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({
      name: (event.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
      description: (event.currentTarget.elements.namedItem('description') as HTMLInputElement).value
    })
  }

  return (
    <AppLayout>
      <div className="min-h-[90vh] flex items-center">
        <div className="max-w-[875px] w-full m-auto">
          <div className="text-center text-3xl mb-6">Create a project</div>
          <div className="text-center text-gray-400 text-base mb-10 font-light">Set up a new project to organize your intelligent agents and workflows. Projects help you structure your business intelligence and allow for seamless deployment across the Epsimo ecosystem.</div>
          <form onSubmit={handleSubmit} className="m-auto space-y-4 max-w-[616px]">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="Enter project name" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter project description" required />
              <textarea></textarea>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" size="lg">Add Project</Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
