
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NotesContextType {
  notes: Note[];
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  createNote: () => void;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  searchNotes: (query: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  // Load notes from local storage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to parse notes from localStorage', error);
      }
    } else {
      // Create a welcome note if no notes exist
      const welcomeNote: Note = {
        id: crypto.randomUUID(),
        title: 'Welcome to Notes',
        content: 'Start writing your thoughts here...',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setNotes([welcomeNote]);
      setCurrentNote(welcomeNote);
    }
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNote(newNote);
    toast.success('New note created');
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );

    // Also update current note if it's the one being edited
    if (currentNote && currentNote.id === id) {
      setCurrentNote((prev) => 
        prev ? { ...prev, ...updates, updatedAt: Date.now() } : prev
      );
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    
    // If the deleted note is the current note, set currentNote to null
    if (currentNote && currentNote.id === id) {
      setCurrentNote(null);
    }
    
    toast.success('Note deleted');
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowercaseQuery) ||
        note.content.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        currentNote,
        setCurrentNote,
        createNote,
        updateNote,
        deleteNote,
        searchNotes
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
