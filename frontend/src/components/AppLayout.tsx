import { FC, ReactNode } from "react"
import SidebarComponent from "./sidebar-component"

type propsType = {
  children?: ReactNode
}

const AppLayout: FC<propsType> = ({ children }) => {
  return (
    <div className="h-screen">
      <SidebarComponent />
      <div className="transition-all duration-300 ease-in-out mx-auto pl-[277px]">
        <div className="max-w-[1073px] mx-auto p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AppLayout;
