import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { Course, Project } from '../../models/entities';
import { Icon } from '../../components/Icon';
export type StudyKind = 'course' | 'project';
export interface StudyEditorHandle { open: (kind: StudyKind, item?: Course | Project) => void }
interface Props { courses: Course[]; saveCourse: (course: Course) => Promise<void>; saveProject: (project: Project) => Promise<void>; removeCourse: (id: string) => Promise<void>; removeProject: (id: string) => Promise<void> }
export const StudyEditor = forwardRef<StudyEditorHandle, Props>(function StudyEditor(props, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [kind, setKind] = useState<StudyKind>('course');
  const [original, setOriginal] = useState<Course | Project>();
  const [name, setName] = useState('');
  const [startDate, setStart] = useState('');
  const [endDate, setEnd] = useState('');
  const [isCurrent, setCurrent] = useState(false);
  const [courseId, setCourse] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  useImperativeHandle(ref, () => ({ open(nextKind, item) {
    previous.current = document.activeElement as HTMLElement;
    setKind(nextKind); setOriginal(item); setName(item?.name ?? ''); setError('');
    const course = item as Course | undefined;
    setStart(course?.startDate ?? ''); setEnd(course?.endDate ?? ''); setCurrent(course?.isCurrent ?? false);
    setCourse((item as Project | undefined)?.courseId ?? '');
    dialog.current?.showModal(); input.current?.focus();
  }}));
  function close() {
    if (lock.current) return;
    const c = original as Course | undefined; const p = original as Project | undefined;
    const changed = name !== (original?.name ?? '') || (kind === 'course' ? startDate !== (c?.startDate ?? '') || endDate !== (c?.endDate ?? '') || isCurrent !== (c?.isCurrent ?? false) : courseId !== (p?.courseId ?? ''));
    if (!changed || window.confirm('Stäng utan att spara ändringarna?')) dialog.current?.close();
  }
  async function perform(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { await action(); dialog.current?.close(); }
    catch (error) { setError(error instanceof Error ? error.message : 'Ändringen kunde inte sparas. Försök igen.'); }
    finally { lock.current = false; setBusy(false); }
  }
  function save() {
    if (!name.trim()) { setError(kind === 'course' ? 'Skriv ett kursnamn.' : 'Skriv ett projektnamn.'); input.current?.focus(); return; }
    if (kind === 'course' && startDate && endDate && startDate > endDate) { setError('Slutdatum får inte ligga före startdatum.'); return; }
    void perform(async () => {
      const id = original?.id ?? (crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,'0')).join(''));
      const base = { id, name: name.trim(), description: original?.description ?? '' };
      if (kind === 'course') await props.saveCourse({ ...base, startDate: startDate || undefined, endDate: endDate || undefined, isCurrent });
      else await props.saveProject({ ...base, courseId: courseId || undefined });
    });
  }
  return <dialog ref={dialog} className="note-editor study-editor" aria-labelledby="study-editor-title" onCancel={e => { e.preventDefault(); close(); }} onClose={() => { if (previous.current?.isConnected) previous.current.focus(); else document.querySelector<HTMLElement>('#main')?.focus(); }}><form onSubmit={e => { e.preventDefault(); save(); }}>
    <div className="dialog-header"><h2 id="study-editor-title">{original ? 'Redigera' : kind === 'course' ? 'Ny' : 'Nytt'} {kind === 'course' ? 'kurs' : 'projekt'}</h2><button className="icon-button" type="button" aria-label="Stäng studieformulär" onClick={close} disabled={busy}><Icon name="close"/></button></div>
    <label htmlFor="study-name">{kind === 'course' ? 'Kursnamn' : 'Projektnamn'}</label><input ref={input} id="study-name" value={name} onChange={e => setName(e.target.value)} autoComplete="off" aria-required="true" disabled={busy}/>
    {kind === 'course' ? <><div className="study-dates"><div><label htmlFor="course-start">Startdatum (valfritt)</label><input id="course-start" type="date" value={startDate} onChange={e => setStart(e.target.value)} disabled={busy}/></div><div><label htmlFor="course-end">Slutdatum (valfritt)</label><input id="course-end" type="date" value={endDate} onChange={e => setEnd(e.target.value)} disabled={busy}/></div></div><label className="current-course"><input type="checkbox" checked={isCurrent} onChange={e => setCurrent(e.target.checked)} disabled={busy}/>Aktuell kurs</label><p className="muted">Visas på startsidan. En kurs kan vara aktuell åt gången.</p></> : <><label htmlFor="project-course">Kurs (valfritt)</label><select id="project-course" value={courseId} onChange={e => setCourse(e.target.value)} disabled={busy}><option value="">Fristående</option>{props.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></>}
    {error && <p className="error-message" role="alert">{error}</p>}
    <div className="editor-actions">{original && <button className="delete-button" type="button" disabled={busy} onClick={() => { const message = kind === 'course' ? 'Ta bort kursen? Projekten behålls och blir fristående. Detta går inte att ångra.' : 'Ta bort projektet? Detta går inte att ångra.'; if (window.confirm(message)) void perform(() => kind === 'course' ? props.removeCourse(original.id) : props.removeProject(original.id)); }}>Ta bort</button>}<button className="primary-button" disabled={busy}>{busy ? 'Sparar…' : kind === 'course' ? 'Spara kurs' : 'Spara projekt'}</button></div>
  </form></dialog>;
});

