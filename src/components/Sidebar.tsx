
import React, { useState } from 'react';
import { Search, PlusCircle, Trash2 } from 'lucide-react';
import { useNotes, Note } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Sidebar: React.FC = () => {
  const { notes, createNote, currentNote, setCurrentNote, deleteNote, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  const handleDeleteClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const getNotePreview = (content: string) => {
    // Strip HTML tags if any and return a short preview
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 60) + (plainText.length > 60 ? '...' : '');
  };

  return (
    <div className="w-full h-full flex flex-col bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Notes</h1>
          <Button onClick={createNote} variant="ghost" size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No notes found.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                onClick={() => setCurrentNote(note)}
                className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                  currentNote?.id === note.id ? 'bg-accent border-primary' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {getNotePreview(note.content)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(note.updatedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleDeleteClick(e, note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this note? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
