import type { Course, Project } from '../../models/entities';
import { StudyLinkSelect } from '../../components/StudyLinkSelect';
import { linkValue, selectedLink, validLink } from '../studies/studyLinks';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { Task, TaskStatus } from '../../models/entities';
import { Icon } from '../../components/Icon';
import { taskStatuses } from './taskStatus';
export interface TaskEditorHandle { open: (task?: Task) => void }
export const TaskEditor = forwardRef<TaskEditorHandle, { courses: Course[]; projects: Project[]; linksReady: boolean; onSave: (task: Task) => Promise<void>; onRemove: (id: string) => Promise<void> }>(function TaskEditor({ onSave, onRemove, courses, projects, linksReady }, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [original, setOriginal] = useState<Task>();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('today');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  function requestClose() {
    if (busyRef.current) return;
    const changed = link !== linkValue(linksReady ? validLink(original ?? {}, courses, projects) : original ?? {}) || title !== (original?.title ?? '') || status !== (original?.status ?? 'today');
    if (!changed || window.confirm('Stäng utan att spara ändringarna?')) dialog.current?.close();
  }
  useImperativeHandle(ref, () => ({ open(task) {
    previousFocus.current = document.activeElement as HTMLElement;
    setLink(linkValue(linksReady ? validLink(task ?? {}, courses, projects) : task ?? {})); setOriginal(task); setTitle(task?.title ?? ''); setStatus(task?.status ?? 'today'); setError('');
    dialog.current?.showModal(); titleInput.current?.focus();
  }}));
  async function perform(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError('');
    try { await action(); dialog.current?.close(); }
    catch (error) { setError(error instanceof Error ? error.message : 'Ändringen kunde inte sparas. Din inmatning finns kvar.'); }
    finally { busyRef.current = false; setBusy(false); }
  }
  return <dialog ref={dialog} className="note-editor task-editor" aria-labelledby="task-editor-title" onCancel={event => { event.preventDefault(); requestClose(); }} onClose={() => { if (previousFocus.current?.isConnected) previousFocus.current.focus(); else document.querySelector<HTMLElement>('#main')?.focus(); }}>
    <form onSubmit={event => { event.preventDefault(); if (!title.trim()) { setError('Skriv en titel för uppgiften.'); titleInput.current?.focus(); return; } void perform(async () => { const now = new Date().toISOString(); const id = original?.id ?? (crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')); await onSave({ ...original, ...(linksReady ? selectedLink(link) : { courseId: original?.courseId, projectId: original?.projectId }), id, title: title.trim(), status, createdAt: original?.createdAt ?? now, updatedAt: now }); }); }}>
      <div className="dialog-header"><h2 id="task-editor-title">{original ? 'Redigera uppgift' : 'Ny uppgift'}</h2><button type="button" className="icon-button" aria-label="Stäng uppgift" disabled={busy} onClick={requestClose}><Icon name="close"/></button></div>
      <label htmlFor="task-title">Titel</label><input ref={titleInput} id="task-title" value={title} onChange={event => setTitle(event.target.value)} placeholder="Vad är ditt nästa steg?" disabled={busy} autoComplete="off" aria-required="true"/>
      <label htmlFor="task-status">Status</label><select id="task-status" value={status} onChange={event => setStatus(event.target.value as TaskStatus)} disabled={busy}>{taskStatuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      <StudyLinkSelect id="task-link" value={link} onChange={setLink} courses={courses} projects={projects} disabled={busy || !linksReady}/>{!linksReady && <p className="muted">Kopplingar är inte tillgängliga just nu. Befintlig koppling behålls.</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="editor-actions">{original && <button type="button" className="delete-button" disabled={busy} onClick={() => { if (window.confirm('Ta bort uppgiften? Detta går inte att ångra.')) void perform(() => onRemove(original.id)); }}>Ta bort</button>}<button type="submit" className="primary-button" disabled={busy}>{busy ? 'Sparar…' : 'Spara uppgift'}</button></div>
    </form>
  </dialog>;
});
