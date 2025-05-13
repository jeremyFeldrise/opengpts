import { Avatar, AvatarFallback, AvatarImage } from "./avatar.tsx"
import { Button } from "./button.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.tsx"
import { ArrowRight, Mail, ChevronDown, CircleHelp, FileText, MessageSquare, Plus, Search, BrainCircuit, Briefcase, Armchair, Sparkle, Ellipsis } from "lucide-react";
import ModalComponent from "./modalComponent";
import { ChangeEvent, useState } from "react";
import logo from "../assets/images/logo_espimo.png"
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from 'react-query';
import { getThreadInfo } from '../api/auth';

function RoundedPlusComponent() {
  return (
    <div className="flex justify-center items-center rounded-full w-[36px] h-[36px] bg-[#f4f4f4] text-black">
      <Plus size="1em" className="text-3xl" />
    </div>
  )
}

export default function SidebarComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenCommercial, setIsOpenCommercial] = useState(false)
  const [path, setPath] = useState('')
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const { data: threadInfo, isLoading: isLoadingThreadInfo } = useQuery('threadInfo', getThreadInfo, {
    refetchInterval: 5000,
  });

  if (isLoadingThreadInfo) {
    return <div>Loading...</div>;
  }
  const createSubArr = [
    {
      title: "Blog Post",
      desc: 'Create SEO-optimized blog posts',
      icon: <Armchair />,
      path: '/create/blog',
      value: 1
    },
    {
      title: "Social Media Post",
      desc: 'Generate engaging posts for Linkedin, Twitter, ...',
      icon: <MessageSquare size={48} />,
      path: '/create/social',
      value: 2
    },
    {
      title: "Email",
      desc: 'write persuasive emails for your campaigns',
      icon: <Mail size={48} />,
      path: '/create/email',
      value: 3
    },
    {
      title: "Personalized",
      desc: "Create any type of customized content",
      icon: <Sparkle size={48} />,
      path: '/ai-chat',
      value: 4
    },
  ]
  const commercialSubArr = [
    {
      title: "Customer Briefs",
      desc: "Generate engaging customer briefs.",
      icon: <FileText size={48} />,
      path: '/create/customer-brief',
      value: 1
    },
    {
      title: "Offers Workbench",
      desc: "",
      icon: <Armchair />,
      path: '/offer-data-list',
      value: 2
    },
    {
      title: "Offers Research Workbench",
      desc: "",
      icon: <Search size={48} />,
      path: '/offer-research',
      value: 3
    },
    {
      title: "Offers To Agent Workbench",
      desc: "",
      icon: <BrainCircuit size={48} />,
      path: '/new-offer-agent',
      value: 4
    },
  ]

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    arr: any[]
  ) => {
    const getPath = arr.find((item) => item.value === Number(e.target.value))
    setPath(getPath.path)
  }

  const goTo = () => {
    console.log("goto")
  }

  const handleSignOut = async () => {
    logOut()
  };

  return (
    <>
      <div className=" 
      max-w-[277px] 
      bg-[#fefefe] 
      w-full 
      border-r 
      border-solid 
      fixed 
      top-0 
      left-0 
      h-screen
      shadow-[0px_0px_10px_0px_rgba(56,56,56,0.15)]
      rounded-r-[20px]
      p-[20px]
      flex
      flex-col
      justify-between
    ">
        <div className="mb-[30px] flex justify-center">
          <img src={logo} alt="Logo" />
        </div>
        <div className="mb-14">
          <div>
            <Button
              className="w-full justify-start"
              asChild
              leftElem={<Plus />}
            ><a href="/dashboard">New Chat</a></Button>
          </div>
          <div>
            <Button
              className="w-full justify-start"
              variant="ghost"
              leftElem={<Briefcase />}
              onClick={() => setIsOpen(true)}
            >Projects</Button>
          </div>
        </div>
        <div className="grow">
          <div className="text-lg mb-2">Your Chats</div>
          <div className="w-full flex justify-between mb-2">
            <Button variant='ghost' className="p-0 text-left">
              <div>
                <div className="truncate text-base max-w-[165px]">Generate Blog Content text too long</div>
                <div className="text-md text-gray-400 truncate max-w-[165px]">Bot name | Project Name</div>
              </div>
            </Button>
            <Button variant="ghost" className="p-0"><Ellipsis /></Button>
          </div>
          <div>
            <Button className="w-full justify-between text-base p-0" variant="ghost" rightElem={<ArrowRight />}>View All Chats</Button>
          </div>
        </div>
        <div>
          <Button className="w-full h-auto flex justify-between" rightElem={<RoundedPlusComponent />}>
            <div className="text-left">
              <div className="text-base text-[#f4f4f4]">Credits</div>
              <div className="font-medium text-xl">{threadInfo?.thread_counter}/{threadInfo?.thread_max}</div>
            </div>
          </Button>
        </div>
        <div className="py-4">
          <Button asChild className="w-full justify-start" variant="ghost" leftElem={<CircleHelp />} >
            <Link to="https://doc.epsimoai.com/guide/getting-started" >FAQ</Link>
          </Button>
        </div>
        <div className="border-t-2 border-solid py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center p-1 space-x-2">
                <Avatar className="w-10 bg-gradient-to-l from-blue-500 to-purple-500 text-white">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div>John Doe</div>
                  <div className="text-xs text-gray-500">john_doe@hello.com</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ModalComponent title="Create Content" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col max-w-[843px] items-center justify-center text-center">
          <h2 className="text-3xl font-semibold mb-4">What would you like to create today ?</h2>
          <p className="text-gray-400 text-base mb-6">Choose the type of content to generate with our advanced AI intelligence. Our specialized agents will create quality content tailored to your brand and objectives. Select an option to get started.</p>
          <div className="grid grid-cols-2 gap-4">
            {createSubArr.map((item, i) => (
              <label key={i} htmlFor={`option-${item.value}`} className="cursor-pointer my-4">
                <input
                  type="radio"
                  name="options"
                  id={`option-${item.value}`}
                  value={item.value}
                  className="peer invisible absolute"
                  onChange={(e) => handleChange(e, createSubArr)}
                />
                <div className="
                  rounded-lg 
                  p-6 
                  flex flex-col
                  justify-center
                  items-center
                  shadow-[0px_0px_10px_0px_rgba(56,56,56,0.15)]
                  transition-all 
                  peer-checked:border-blue-600 
                  peer-checked:bg-purple-50 
                  peer-checked:ring-2 
                  peer-checked:ring-purple-300
                  h-full"
                >
                  <div className="text-purple-500 mb-2">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <Button className="w-full" onClick={goTo}>Confirm my choice <ArrowRight /></Button>
        </div>
      </ModalComponent>
      <ModalComponent title="Commercial Offers" isOpen={isOpenCommercial} onClose={() => setIsOpenCommercial(false)}>
        <div className="flex flex-col max-w-[843px] items-center justify-center text-center">
          <h2 className="text-3xl font-semibold mb-4">What would you like to create today ?</h2>
          <p className="text-gray-400 text-base mb-6">Choose the type of content to generate with our advanced AI intelligence. Our specialized agents will create quality content tailored to your brand and objectives. Select an option to get started.</p>
          <div className="grid grid-cols-2 gap-4">
            {commercialSubArr.map((item, i) => (
              <label key={i} htmlFor={`option-${item.value}`} className="cursor-pointer my-4">
                <input
                  type="radio"
                  name="options"
                  id={`option-${item.value}`}
                  value={item.value}
                  className="peer invisible absolute"
                  onChange={(e) => handleChange(e, commercialSubArr)}
                />
                <div className="
                  rounded-lg 
                  p-6 
                  flex flex-col
                  justify-center
                  items-center
                  shadow-[0px_0px_10px_0px_rgba(56,56,56,0.15)]
                  transition-all 
                  peer-checked:border-blue-600 
                  peer-checked:bg-purple-50 
                  peer-checked:ring-2 
                  peer-checked:ring-purple-300
                  h-full"
                >
                  <div className="text-purple-500 mb-2">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <Button className="w-full" onClick={goTo}>Confirm my choice <ArrowRight /></Button>
        </div>
      </ModalComponent>
    </>
  )
}
