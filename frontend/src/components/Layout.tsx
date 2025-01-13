import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Logo } from "./Logo";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { getThreadInfo } from "../api/auth";
import { useQuery } from "react-query";

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

  const { data: threadInfo, isLoading: isLoadingThreadInfo } = useQuery('threadInfo', getThreadInfo, {
    refetchInterval: 5000,
  });

  if (isLoadingThreadInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div
        className={`hidden lg:flex lg:flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : ''
          }`}
        style={{ width: isSidebarCollapsed ? '5rem' : `${sidebarWidth}px` }}
      >
        <div className="flex flex-col h-full px-6 py-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center h-16 shrink-0">
            <Logo className="w-auto h-8" />
          </div>
          <nav className="flex flex-col flex-1 mt-5">
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => props.setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>

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

            <div className="flex items-center gap-5 gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View profile</span>
                <UserCircleIcon className="w-8 h-8" aria-hidden="true" />
              </button>
              <div className="flex items-end gap-1">
                <div className="text-sm font-semibold text-gray-900">
                  {threadInfo?.thread_counter}
                </div>
                <div >/</div>
                <div className="text-sm font-normal text-gray-400">
                  {threadInfo?.thread_max} Credits
                </div>
                <div className="flex items-center gap-2">
                  {/* Add a button to go to the page product display */}
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => window.location.href = "/product-display"}>Buy</button>
                </div>
              </div>
              <Button onClick={logOut}>
                Logout
              </Button>
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
        </header>

        {/* Main content area */}
        <main className="flex-1 py-10 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            {props.children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar */}
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
    </div>
  );
}