import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import MobileNavigation from './MobileNavigation.jsx';
import AddTransactionModal from '../common/AddTransactionModal.jsx';

export const AppLayout = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text flex flex-col lg:flex-row transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Navigation Header */}
        <MobileNavigation />

        {/* Top Header */}
        <Header onOpenAddTransaction={() => setIsAddModalOpen(true)} />

        {/* Page Content Container */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshTrigger, onTransactionAdded: handleTransactionAdded }} />
        </main>
      </div>

      {/* Global Add Record / Transaction Modal */}
      {isAddModalOpen && (
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
    </div>
  );
};

export default AppLayout;
