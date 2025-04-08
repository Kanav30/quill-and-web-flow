
import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="flex items-center justify-center h-full bg-secondary/30">
        <div className="text-center p-6">
          <h2 className="text-xl font-medium mb-2">No Note Selected</h2>
          <p className="text-muted-foreground">Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      {isMobile && (
        <div className="sticky top-0 z-10 bg-background p-2 border-b">
          <Button variant="ghost" size="sm" onClick={onBackClick} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to notes
          </Button>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="text-xl font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 mb-4"
        />
        
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing here..."
          className="note-content resize-none min-h-[calc(100vh-150px)] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
