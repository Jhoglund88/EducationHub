import type { Course, Project } from '../models/entities';
import type { EntityRepository } from './StudyRepository';
interface StudiesData { courses: Course[]; projects: Project[] }
const KEY = 'education-hub.studies.v1';
function validDate(value: unknown): boolean {
  if (value === undefined) return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value); return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}
function base(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && item.id.length > 0 && typeof item.name === 'string' && item.name.trim().length > 0 && typeof item.description === 'string';
}
function course(value: unknown): value is Course {
  return base(value) && typeof value.isCurrent === 'boolean' && validDate(value.startDate) && validDate(value.endDate) && !(value.startDate && value.endDate && String(value.startDate) > String(value.endDate));
}
function project(value: unknown): value is Project { return base(value) && (value.courseId === undefined || typeof value.courseId === 'string'); }
export class LocalStudiesRepository {
  private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem'>;
  constructor(getStorage: () => Pick<Storage, 'getItem' | 'setItem'> = () => window.localStorage) { this.getStorage = getStorage; }
  readonly courses: EntityRepository<Course> = {
    list: async () => (await this.load()).courses,
    save: async item => {
      if (!course(item)) throw new Error('Kontrollera kursnamnet och datumen. Slutdatum får inte ligga före startdatum.');
      const data = await this.load();
      data.courses = [...data.courses.filter(c => c.id !== item.id).map(c => item.isCurrent ? { ...c, isCurrent: false } : c), item];
      this.write(data);
    },
    remove: async id => {
      const data = await this.load();
      data.courses = data.courses.filter(c => c.id !== id);
      data.projects = data.projects.map(p => { if (p.courseId !== id) return p; const { courseId: _courseId, ...standalone } = p; return standalone; });
      this.write(data);
    },
  };
  readonly projects: EntityRepository<Project> = {
    list: async () => (await this.load()).projects,
    save: async item => {
      if (!project(item)) throw new Error('Skriv ett projektnamn.');
      const data = await this.load();
      if (item.courseId && !data.courses.some(c => c.id === item.courseId)) throw new Error('Kursen finns inte längre. Välj en annan kurs eller Fristående.');
      data.projects = [...data.projects.filter(p => p.id !== item.id), item]; this.write(data);
    },
    remove: async id => { const data = await this.load(); data.projects = data.projects.filter(p => p.id !== id); this.write(data); },
  };
  async load(): Promise<StudiesData> {
    try {
      const raw = this.getStorage().getItem(KEY);
      if (raw === null) return { courses: [], projects: [] };
      const data = JSON.parse(raw) as StudiesData;
      if (!data || !Array.isArray(data.courses) || !Array.isArray(data.projects) || !data.courses.every(course) || !data.projects.every(project)
        || new Set(data.courses.map(c => c.id)).size !== data.courses.length || new Set(data.projects.map(p => p.id)).size !== data.projects.length
        || data.courses.filter(c => c.isCurrent).length > 1 || data.projects.some(p => p.courseId !== undefined && !data.courses.some(c => c.id === p.courseId))) throw new Error();
      return data;
    } catch { throw new Error('Studierna kunde inte läsas. Kontrollera lokal lagring och försök igen. Sparade data har inte ändrats.'); }
  }
  private write(data: StudiesData) {
    try { this.getStorage().setItem(KEY, JSON.stringify(data)); }
    catch { throw new Error('Ändringen kunde inte sparas. Lagringen kan vara full eller blockerad. Din inmatning finns kvar – försök igen.'); }
  }
}
export const studiesRepository = new LocalStudiesRepository();
