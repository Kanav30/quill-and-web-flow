
import React, { useState } from 'react';
import { NotesProvider } from '@/contexts/NotesContext';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  
  return (
    <NotesProvider>
      <div className="h-screen flex flex-col bg-background transition-colors duration-300">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              QuillNote
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </header>
        
        <main className="flex-1 flex overflow-hidden">
          {isMobile ? (
            // Mobile view - show either sidebar or editor
            showSidebar ? (
              <div className="w-full h-full">
                <Sidebar />
                <div className="fixed bottom-6 right-6 z-10">
                  <Button 
                    onClick={() => setShowSidebar(false)}
                    className="rounded-full shadow-lg h-14 w-14 p-0"
                    size="icon"
                  >
                    <span className="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                  </Button>
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
              <div className="flex-1 h-full border-l">
                <NoteEditor />
              </div>
            </>
          )}
        </main>
        <Toaster />
      </div>
    </NotesProvider>
  );
};

export default Index;
