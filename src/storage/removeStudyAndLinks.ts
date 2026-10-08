import { LocalNotesRepository } from './LocalNotesRepository.ts';
import { LocalTasksRepository } from './LocalTasksRepository.ts';
import { LocalStudiesRepository } from './LocalStudiesRepository.ts';
// Stage using existing repositories, then commit synchronously. A failed write rolls back earlier writes.
export async function removeStudyAndLinks(kind: 'course' | 'project', id: string, storage: Storage = window.localStorage): Promise<void> {
  const staged = new Map<string,string>();
  const originals = new Map<string,string | null>();
  const buffer = {
    getItem(key: string) { if (!originals.has(key)) originals.set(key,storage.getItem(key)); return staged.get(key) ?? originals.get(key) ?? null; },
    setItem(key: string,value: string) { if (!originals.has(key)) originals.set(key,storage.getItem(key)); staged.set(key,value); },
  };
  const notes = new LocalNotesRepository(()=>buffer);
  const tasks = new LocalTasksRepository(()=>buffer);
  const studies = new LocalStudiesRepository(()=>buffer);
  const field = kind === 'course' ? 'courseId' : 'projectId';
  const noteData = await notes.list(); const taskData = await tasks.list();
  for (const note of noteData) if (note[field] === id) await notes.save({...note,[field]:undefined});
  for (const task of taskData) if (task[field] === id) await tasks.save({...task,[field]:undefined});
  await (kind === 'course' ? studies.courses : studies.projects).remove(id);
  const written: string[] = [];
  try {
    for (const [key,value] of staged) { storage.setItem(key,value); written.push(key); }
  } catch {
    let restored = true;
    for (const key of written.reverse()) {
      try { const previous=originals.get(key); if (previous == null) storage.removeItem(key); else storage.setItem(key,previous); }
      catch { restored=false; }
    }
    throw new Error(restored ? 'Borttagningen kunde inte sparas. Ingen ändring har gjorts. Försök igen.' : 'Lagringen blockerade borttagningen och återställningen. Innehållet har behållits, men kontrollera kopplingarna efter omladdning.');
  }
}
