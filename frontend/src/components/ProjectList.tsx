import { useQuery } from 'react-query'
import { getProjects, selectProject, deleteProject } from '../api/projects'
import { useNavigate } from 'react-router-dom'
import { useConfigList } from '../hooks/useConfigList'
import ProjectCard from './ProjectCard'
import ModalComponent from './modalComponent'
import { useState } from 'react'
import { Trash, X } from 'lucide-react'
import { Button } from './button'

interface Project {
  project_id: string
  name: string
  description: string
}

export default function ProjectList() {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [isLoadingDeletion, setIsLoadingDeletion] = useState(false)
  const { data: projects, isLoading, isError, refetch } = useQuery<Project[]>('projects', getProjects)
  const { configs } = useConfigList();

  const navigate = useNavigate();

  async function chooseProject(projectId: string, projectName: string) {
    const project = projects?.find((item) => item.project_id === projectId)
    await selectProject(projectId, projectName, project?.description || '');
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

  function handleDelete(projectId: string) {
    setDeleteId(projectId)
    setIsOpenConfirm(true)
  }

  async function handleDeletion() {
    setIsLoadingDeletion(true)
    await deleteProject(deleteId).finally(() => setIsLoadingDeletion(false))
  }

  return (
    <>
      {projects?.map((project) => (
        <ProjectCard key={project.project_id} project={project} chooseProject={chooseProject} handleDelete={handleDelete} refetch={refetch} />
      ))}
      <ModalComponent title="Confirm Project Deletion" isOpen={isOpenConfirm} onClose={() => {
        setIsOpenConfirm(false)
        setDeleteId('')
      }}>
        <div className="">
          <div className="text-sm mb-4 text-gray-400 font-light">Warning: This action cannot be undone. All intelligences, agents, and data associated with this project will be permanently deleted. Applications using this project will no longer be able to access its functionalities.</div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              rightElem={<X />}
              onClick={() => {
                setIsOpenConfirm(false)
                setDeleteId('')
              }}>Cancel</Button>
            <Button
              disabled={isLoadingDeletion}
              onClick={handleDeletion}
              rightElem={<Trash />}
            >
              {isLoadingDeletion ? "Please wait..." : "Confirm"}
            </Button>
          </div>
        </div>
      </ModalComponent>
    </>
  )
}

function LoadingCard() {
  return (
    <div className='text-center'>Loading...</div>
  )
}

function ErrorCard() {
  return (
    <div className="text-center text-red-500">Error loading projects</div>
  )
}
