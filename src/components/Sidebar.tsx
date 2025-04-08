
import React, { useState } from 'react';
import { Search, PlusCircle, Trash2, Plus, Filter } from 'lucide-react';
import { useNotes, Note } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar: React.FC = () => {
  const { notes, createNote, currentNote, setCurrentNote, deleteNote, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  const handleCreateNote = () => {
    createNote();
    toast({
      title: "New note created",
      description: "Your new note is ready for editing",
      duration: 3000,
    });
  };

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
      toast({
        title: "Note deleted",
        description: "Your note has been permanently removed",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const getNotePreview = (content: string) => {
    // Strip HTML tags if any and return a short preview
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 60) + (plainText.length > 60 ? '...' : '');
  };

  return (
    <div className="w-full h-full flex flex-col bg-card/50 transition-colors duration-200">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notes ({notes.length})</h2>
          <Button 
            onClick={handleCreateNote} 
            variant="ghost" 
            size="icon"
            className="rounded-full hover:bg-primary/10"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Create new note</span>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9 bg-muted/40 border-muted-foreground/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            {searchQuery ? (
              <>
                <Filter className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p>No notes match your search.</p>
                <p className="text-sm mt-1">Try a different search term.</p>
              </>
            ) : (
              <>
                <PlusCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p>No notes yet.</p>
                <p className="text-sm mt-1">Create your first note!</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                onClick={() => setCurrentNote(note)}
                className={`p-3 cursor-pointer hover:bg-accent/50 transition-all duration-150 ${
                  currentNote?.id === note.id ? 'bg-accent shadow-md border-primary/50' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{note.title || "Untitled"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
                      {getNotePreview(note.content)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {format(note.updatedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    onClick={(e) => handleDeleteClick(e, note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete note</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
