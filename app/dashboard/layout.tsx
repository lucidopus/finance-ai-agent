'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            VerifAI
          </h2>
          <p className="text-xs text-gray-400 mt-1">AI-Powered Financial Intelligence</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-white border border-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <span className="mr-3">📋</span>
                My Cases
              </a>
            </li>
            <li>
              <a
                href="/dashboard/analytics"
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  pathname === '/dashboard/analytics'
                    ? 'bg-gradient-to-r from-green-600/20 to-green-500/20 text-white border border-green-500/30'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <span className="mr-3">📊</span>
                Analytics
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.firstName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 px-6 py-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-sm text-gray-400">Ready to optimize your finances?</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth/signin')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 cursor-pointer"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}