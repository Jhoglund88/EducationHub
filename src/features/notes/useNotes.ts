import { useCallback, useEffect, useState } from 'react';
import type { Note } from '../../models/entities';
import { notesRepository } from '../../storage/LocalNotesRepository';
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setNotes(await notesRepository.list()); setError(''); }
    catch (error) { setError(error instanceof Error ? error.message : 'Anteckningarna kunde inte läsas.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  async function save(note: Note) {
    await notesRepository.save(note);
    setNotes(current => [note, ...current.filter(item => item.id !== note.id)].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)));
  }
  async function remove(id: string) {
    await notesRepository.remove(id);
    setNotes(current => current.filter(note => note.id !== id));
  }
  return { notes, error, loading, reload, save, remove };
}
