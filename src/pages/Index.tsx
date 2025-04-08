
import React, { useState } from 'react';
import { NotesProvider } from '@/contexts/NotesContext';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  
  return (
    <NotesProvider>
      <div className="h-screen flex flex-col">
        <header className="border-b bg-background">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">QuillNote</h1>
          </div>
        </header>
        
        <main className="flex-1 flex overflow-hidden">
          {isMobile ? (
            // Mobile view - show either sidebar or editor
            showSidebar ? (
              <div className="w-full h-full">
                <Sidebar />
                <div className="fixed bottom-4 right-4">
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <NoteEditor onBackClick={() => setShowSidebar(true)} />
              </div>
            )
          ) : (
            // Desktop view - show both sidebar and editor
            <>
              <div className="w-80 h-full">
                <Sidebar />
              </div>
              <div className="flex-1 h-full">
                <NoteEditor />
              </div>
            </>
          )}
        </main>
      </div>
    </NotesProvider>
  );
};

export default Index;
