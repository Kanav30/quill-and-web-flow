
import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const NoteEditor: React.FC<{ onBackClick?: () => void }> = ({ onBackClick }) => {
  const { currentNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (currentNote) {
      updateNote(currentNote.id, { title: newTitle });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (currentNote) {
      updateNote(currentNote.id, { content: newContent });
    }
  };

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="p-3 bg-primary/10 rounded-full inline-flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          </div>
          <h2 className="text-xl font-medium mb-2">No Note Selected</h2>
          <p className="text-muted-foreground">Select an existing note from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background transition-colors duration-200">
      {isMobile && (
        <div className="sticky top-0 z-10 bg-background p-2 border-b backdrop-blur-sm bg-background/80">
          <Button variant="ghost" size="sm" onClick={onBackClick} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to notes
          </Button>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="flex items-center text-xs text-muted-foreground mb-6">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Last edited on {format(currentNote.updatedAt, 'MMMM d, yyyy')}</span>
        </div>
        
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="text-2xl font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 mb-4"
        />
        
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing here..."
          className="note-content resize-none min-h-[calc(100vh-250px)] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
