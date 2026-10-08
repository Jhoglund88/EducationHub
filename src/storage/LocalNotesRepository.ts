import type { Note } from '../models/entities';
import type { EntityRepository } from './StudyRepository';
const KEY = 'education-hub.notes.v1';
function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false;
  const n = value as Record<string, unknown>;
  return ['id', 'title', 'text', 'createdAt', 'updatedAt'].every(key => typeof n[key] === 'string')
    && Number.isFinite(Date.parse(n.createdAt as string)) && Number.isFinite(Date.parse(n.updatedAt as string))
    && (n.courseId === undefined || typeof n.courseId === 'string')
    && (n.projectId === undefined || typeof n.projectId === 'string');
}
export class LocalNotesRepository implements EntityRepository<Note> {
  private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem'>;
  constructor(getStorage: () => Pick<Storage, 'getItem' | 'setItem'> = () => window.localStorage) { this.getStorage = getStorage; }
  async list(): Promise<Note[]> {
    try {
      const raw = this.getStorage().getItem(KEY);
      if (raw === null) return [];
      const data: unknown = JSON.parse(raw);
      if (!Array.isArray(data) || !data.every(isNote) || new Set(data.map(n => n.id)).size !== data.length) throw new Error();
      return data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch { throw new Error('Anteckningarna kunde inte läsas. Kontrollera att webbläsaren tillåter lokal lagring och försök igen. Sparade data har inte ändrats.'); }
  }
  async save(note: Note): Promise<void> {
    if (note.courseId && note.projectId) throw new Error('Välj högst en koppling: kurs eller projekt.');
    const notes = await this.list();
    this.write([note, ...notes.filter(item => item.id !== note.id)]);
  }
  async remove(id: string): Promise<void> { this.write((await this.list()).filter(item => item.id !== id)); }
  private write(notes: Note[]) {
    try { this.getStorage().setItem(KEY, JSON.stringify(notes)); }
    catch { throw new Error('Ändringen kunde inte sparas. Lagringen kan vara full eller blockerad. Din text finns kvar – försök igen.'); }
  }
}
export const notesRepository = new LocalNotesRepository();
