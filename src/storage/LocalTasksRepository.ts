import type { Task } from '../models/entities';
import type { EntityRepository } from './StudyRepository';
const KEY = 'education-hub.tasks.v1';
function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const n = value as Record<string, unknown>;
  return ['id', 'title', 'createdAt', 'updatedAt'].every(key => typeof n[key] === 'string')
    && typeof n.title === 'string' && n.title.trim().length > 0
    && ['today', 'later', 'done'].includes(n.status as string)
    && Number.isFinite(Date.parse(n.createdAt as string)) && Number.isFinite(Date.parse(n.updatedAt as string))
    && (n.courseId === undefined || typeof n.courseId === 'string')
    && (n.projectId === undefined || typeof n.projectId === 'string');
}
export class LocalTasksRepository implements EntityRepository<Task> {
  private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem'>;
  constructor(getStorage: () => Pick<Storage, 'getItem' | 'setItem'> = () => window.localStorage) { this.getStorage = getStorage; }
  async list(): Promise<Task[]> {
    try {
      const raw = this.getStorage().getItem(KEY);
      if (raw === null) return [];
      const data: unknown = JSON.parse(raw);
      if (!Array.isArray(data) || !data.every(isTask) || new Set(data.map(n => n.id)).size !== data.length) throw new Error();
      return data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch { throw new Error('Uppgifterna kunde inte läsas. Kontrollera att webbläsaren tillåter lokal lagring och försök igen. Sparade data har inte ändrats.'); }
  }
  async save(note: Task): Promise<void> {
    if (!isTask(note)) throw new Error('Uppgiften måste ha en titel och en giltig status.');
    const tasks = await this.list();
    this.write([note, ...tasks.filter(item => item.id !== note.id)]);
  }
  async remove(id: string): Promise<void> { this.write((await this.list()).filter(item => item.id !== id)); }
  private write(tasks: Task[]) {
    try { this.getStorage().setItem(KEY, JSON.stringify(tasks)); }
    catch { throw new Error('Ändringen kunde inte sparas. Lagringen kan vara full eller blockerad. Din text finns kvar – försök igen.'); }
  }
}
export const tasksRepository = new LocalTasksRepository();



