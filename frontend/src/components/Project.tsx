import ProjectList from './ProjectList'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from './AppLayout'
import { Button } from './button';
import { ArrowRight } from 'lucide-react';


export default function Project() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token') || localStorage.getItem('token') == 'undefined') {
      navigate('/login')
    }
  }, [navigate])

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Projects</h1>
        <Button rightElem={<ArrowRight />} onClick={() => navigate('/new_project')}>Create a Project</Button>
      </div>
      <div className="text-base text-gray-400 mb-10 font-light">Projects are workspaces where you create and organize your AI agents. Each project serves as a container for different agents that can share knowledge and context. Once set up, these agents can be deployed to Content Genius, Lead Genius, or called via API to power your marketing and sales solutions.</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProjectList />
      </div>
    </AppLayout>
  )
}
