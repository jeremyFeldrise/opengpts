import { Avatar, AvatarFallback, AvatarImage } from "./avatar.tsx"
import { Button } from "./button.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.tsx"
import { ArrowRight, ChevronDown, CircleHelp, Plus, Briefcase, Ellipsis } from "lucide-react";
import { ReactNode } from "react";
import logo from "../assets/images/logo_espimo.png"
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from 'react-query';
import { getThreadInfo } from '../api/auth';
import { ScrollArea } from "./scroll-area.tsx";

function RoundedPlusComponent() {
  return (
    <div className="flex justify-center items-center rounded-full w-[36px] h-[36px] bg-[#f4f4f4] text-black">
      <Plus size="1em" className="text-3xl" />
    </div>
  )
}

type SidebarProps = {
  newChat: (id: string | null) => void;
  chat?: ReactNode,
}

export default function SidebarComponent({ chat, newChat }: SidebarProps) {
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
        <div className="mb-10">
          <div>
            <Button
              className="w-full justify-start"
              onClick={() => newChat(null)}
              leftElem={<Plus />}
            >New Chat</Button>
          </div>
          <div>
            <Button
              className="w-full justify-start"
              variant="ghost"
              leftElem={<Briefcase />}
              onClick={() => navigate('/project')}
            >Project</Button>
          </div>
        </div>
        <div className="grow max-h-[350px] overflow-auto">
          <ScrollArea>
            <div className="text-lg mb-2">Your Chats</div>
            {chat}
          </ScrollArea>
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
      </div >
    </>
  )
}
