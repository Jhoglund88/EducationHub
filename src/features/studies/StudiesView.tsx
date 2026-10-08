import type { Course, Project } from '../../models/entities';
import { EmptyState } from '../../components/EmptyState';
import type { StudyKind } from './StudyEditor';
interface Props { courses: Course[]; projects: Project[]; loading: boolean; error: string; onRetry: () => void; onOpen: (kind: StudyKind, item?: Course | Project) => void }
export function StudiesView({ courses, projects, loading, error, onRetry, onOpen }: Props) {
  return <><header className="page-heading"><p className="eyebrow">DIN UTBILDNING</p><h1>Studier</h1><p>En tydlig plats för kurser och projekt.</p></header>
    {error ? <div className="surface feedback"><p role="alert" className="error-message">{error}</p><button className="text-button" onClick={onRetry}>Försök igen</button></div> : loading ? <p role="status">Läser studier…</p> : <>
      <section className="section-block"><div className="section-heading"><h2>Kurser</h2><button className="text-button" onClick={() => onOpen('course')}>+ Ny kurs</button></div>{courses.length ? <ul className="notes-list">{courses.map(c => <li key={c.id}><button className="note-card" onClick={() => onOpen('course',c)}><h2>{c.name}</h2>{c.isCurrent && <span className="study-badge">Aktuell kurs</span>}<p>{c.startDate || c.endDate ? `${c.startDate ?? 'Start ej angiven'} – ${c.endDate ?? 'Slut ej angivet'}` : 'Inga datum angivna'}</p></button></li>)}</ul> : <div className="surface"><EmptyState icon="studies" title="Det du lär dig">Lägg till din första kurs och välj vilken som är aktuell.</EmptyState></div>}</section>
      <section className="section-block"><div className="section-heading"><h2>Projekt</h2><button className="text-button" onClick={() => onOpen('project')}>+ Nytt projekt</button></div>{projects.length ? <ul className="notes-list">{projects.map(p => <li key={p.id}><button className="note-card" onClick={() => onOpen('project',p)}><h2>{p.name}</h2><p>{courses.find(c => c.id === p.courseId)?.name ?? 'Fristående projekt'}</p></button></li>)}</ul> : <div className="surface"><EmptyState icon="notes" title="Det du skapar">Lägg till ett fristående projekt eller koppla det till en kurs.</EmptyState></div>}</section>
    </>}
  </>;
}
