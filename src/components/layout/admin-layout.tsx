import React, { ReactNode } from 'react';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';
import AdminFooter from './admin-footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}