import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './button';
import { useQuery } from 'react-query';
import { getThreadInfo } from '../api/auth';

export function Header() {
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

  return (
    <header className="flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <Logo className="w-auto h-8" />
      </div>
      <div className="flex items-center flex-1 gap-x-4 lg:gap-x-6">
        <div className="text-sm font-semibold leading-6 text-gray-900">
          EpsimoAI: Agent Platform
        </div>
        <div className="flex-1" />



        {/* Notification Icon */}
        <button
          type="button"
          className="p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">View notifications</span>
          <Link to="https://doc.epsimoai.com/guide/getting-started" >FAQ</Link>
        </button>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-gray-900">
            {threadInfo?.thread_counter}
          </div>
          <div>/</div>
          <div className="text-sm font-normal text-gray-400">
            {threadInfo?.thread_max} Credits
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => window.location.href = "/product-display"}>Buy</button>

        </div>
        {/* Profile and Logout */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">

          {
            localStorage.getItem("token") !== null && (
              <Button onClick={logOut}>
                Logout
              </Button>
            )
          }



        </div>
      </div>
    </header>
  );
}
