// --- FIXED FOR ISSUE #65 ---
// DashboardLayout: Base layout with header, nav, and content placeholder

import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Bell, Home, BarChart2, Repeat, User, Settings } from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col font-inter">
      {/* Header */}
      <header className="flex items-center justify-between px-md py-sm bg-surface shadow-md">
        {/* Left: Logo */}
        <Link to="/" className="text-h2 text-primary font-inter font-bold">
          VoteWave
        </Link>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex space-x-md">
          <Link to="/mypolls" className="text-body text-textSecondary hover:text-primary">My Polls</Link>
          <Link to="/toppolls" className="text-body text-textSecondary hover:text-primary">Top Polls</Link>
          <Link to="/repost" className="text-body text-textSecondary hover:text-primary">Repost</Link>
          <Link to="/analytics" className="text-body text-textSecondary hover:text-primary">Analytics</Link>
          <Link to="/settings" className="text-body text-textSecondary hover:text-primary">Settings</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-md">
          <button className="relative">
            <Bell className="w-6 h-6 text-textSecondary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <Link to="/profile">
            <User className="w-7 h-7 text-textSecondary" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-md">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface shadow-md flex justify-around py-sm border-t">
        <Link to="/home">
          <Home className="w-6 h-6 text-textSecondary" />
        </Link>
        <Link to="/mypolls">
          <BarChart2 className="w-6 h-6 text-textSecondary" />
        </Link>
        <Link to="/repost">
          <Repeat className="w-6 h-6 text-textSecondary" />
        </Link>
        <Link to="/settings">
          <Settings className="w-6 h-6 text-textSecondary" />
        </Link>
      </nav>
    </div>
  );
}
