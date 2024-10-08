import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import {
  Dialog as DialogComponent,
  DialogTrigger,
} from "./dialog"

import EditAPIKeysModal from "./EditAPIKeysModal";

interface LayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}



export function Layout(props: LayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [open, setOpen] = useState(false)


  const navigate = useNavigate();



  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = Math.max(200, Math.min(600, e.clientX));
    setSidebarWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);


  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Transition.Root show={props.sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={props.setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => props.setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-white grow gap-y-5">
                  <div className="flex items-center h-16 shrink-0">
                    <Logo className="w-auto h-8" />
                  </div>
                  <nav className="flex flex-col flex-1">
                    <ul role="list" className="flex flex-col flex-1 gap-y-7">
                      <li>{props.sidebar}</li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:w-20' : ''
          }`}
        style={{ width: isSidebarCollapsed ? '5rem' : `${sidebarWidth}px` }}
      >
        <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
          <div className="flex items-center h-16 shrink-0">
            <Logo className="w-auto h-8" />
          </div>
          <nav className="flex flex-col flex-1">
            <ul role="list" className="flex flex-col flex-1 gap-y-7">
              <li>{props.sidebar}</li>
            </ul>
          </nav>
        </div>
        {!isSidebarCollapsed && (
          <div
            className="absolute top-0 bottom-0 right-0 w-1 transition-colors duration-150 ease-in-out bg-gray-200 cursor-col-resize hover:bg-gray-300"
            onMouseDown={() => setIsResizing(true)}
          />
        )}
      </div>

      <div
        className={`lg:pl-${isSidebarCollapsed ? '20' : `[${sidebarWidth}px]`}`}
      >
        <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => props.setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
            <div className="flex items-center flex-1 gap-x-4 lg:gap-x-6">
              <div className="text-sm font-semibold leading-6 text-gray-900">
                {props.subtitle ? (
                  <>
                    Agent: <span className="font-normal">{props.subtitle}</span>
                  </>
                ) : (
                  "EpsimoAI: Agent Platform"
                )}
              </div>
              <div className="flex-1" />
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="w-6 h-6" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <DialogComponent open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">View profile</span>
                      <UserCircleIcon className="w-8 h-8" aria-hidden="true" />
                    </button>
                  </DialogTrigger>
                  <EditAPIKeysModal open={open} setOpen={setOpen}></EditAPIKeysModal>

                </DialogComponent>

                <Button onClick={logOut}>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden p-1 text-gray-400 rounded-md lg:block hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {isSidebarCollapsed ? (
              <ChevronRightIcon className="w-6 h-6" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}