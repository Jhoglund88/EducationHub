import type { Course, Project } from '../models/entities';
export function StudyLinkSelect({ id, value, onChange, courses, projects, disabled }: { id: string; value: string; onChange: (value: string) => void; courses: Course[]; projects: Project[]; disabled: boolean }) {
  return <><label htmlFor={id}>Koppling (valfritt)</label><select className="study-link-select" id={id} value={value} onChange={event=>onChange(event.target.value)} disabled={disabled}><option value="">Ingen koppling</option><optgroup label="Kurser">{courses.map(c=><option key={c.id} value={`course:${c.id}`}>{c.name}</option>)}</optgroup><optgroup label="Projekt">{projects.map(p=><option key={p.id} value={`project:${p.id}`}>{p.name}</option>)}</optgroup></select></>;
}
