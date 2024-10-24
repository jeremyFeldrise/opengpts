import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './button';

export function Header() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

        {/* Project Navigation Link */}
        <Link
          to="/project"
          className="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900"
        >
          Project
        </Link>

        {/* Notification Icon */}
        <button
          type="button"
          className="p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Profile and Logout */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View profile</span>
            <UserCircleIcon className="w-8 h-8" aria-hidden="true" />
          </button>
          <Button onClick={logOut}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
