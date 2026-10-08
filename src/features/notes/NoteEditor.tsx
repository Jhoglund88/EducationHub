import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { Note } from '../../models/entities';
import { Icon } from '../../components/Icon';
export interface NoteEditorHandle { open: (note?: Note) => void }
export const NoteEditor = forwardRef<NoteEditorHandle, { onSave: (note: Note) => Promise<void>; onRemove: (id: string) => Promise<void> }>(function NoteEditor({ onSave, onRemove }, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [original, setOriginal] = useState<Note>();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  function close() { if (!busyRef.current) dialog.current?.close(); }
  function requestClose() {
    if (busyRef.current) return;
    const changed = title !== (original?.title ?? '') || text !== (original?.text ?? '');
    if (!changed || window.confirm('Stäng utan att spara ändringarna?')) close();
  }
  useImperativeHandle(ref, () => ({ open(note) {
    previousFocus.current = document.activeElement as HTMLElement;
    setOriginal(note); setTitle(note?.title ?? ''); setText(note?.text ?? ''); setError('');
    dialog.current?.showModal(); titleInput.current?.focus();
  }}));
  async function perform(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError('');
    try { await action(); dialog.current?.close(); }
    catch (error) { setError(error instanceof Error ? error.message : 'Ändringen kunde inte sparas. Försök igen.'); }
    finally { busyRef.current = false; setBusy(false); }
  }
  return <dialog ref={dialog} className="note-editor" aria-labelledby="editor-title" onCancel={event => { event.preventDefault(); requestClose(); }} onClose={() => previousFocus.current?.focus()}>
    <form onSubmit={event => { event.preventDefault(); if (!title.trim()) { setError('Skriv en rubrik för anteckningen.'); titleInput.current?.focus(); return; } void perform(async () => { const now = new Date().toISOString(); await onSave({ ...original, id: original?.id ?? (crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')), title: title.trim(), text, createdAt: original?.createdAt ?? now, updatedAt: now }); }); }}>
      <div className="dialog-header"><h2 id="editor-title">{original ? 'Redigera anteckning' : 'Ny anteckning'}</h2><button type="button" className="icon-button" aria-label="Stäng anteckning" disabled={busy} onClick={requestClose}><Icon name="close"/></button></div>
      <label htmlFor="note-title">Rubrik</label><input ref={titleInput} id="note-title" value={title} onChange={event => setTitle(event.target.value)} placeholder="Vad vill du komma ihåg?" disabled={busy} autoComplete="off"/>
      <label htmlFor="note-text">Text</label><textarea id="note-text" value={text} onChange={event => setText(event.target.value)} placeholder="Börja skriva…" disabled={busy}/>
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="editor-actions">{original && <button type="button" className="delete-button" disabled={busy} onClick={() => { if (window.confirm('Ta bort anteckningen? Detta går inte att ångra.')) void perform(() => onRemove(original.id)); }}>Ta bort</button>}<button type="submit" className="primary-button" disabled={busy}>{busy ? 'Sparar…' : 'Spara anteckning'}</button></div>
    </form>
  </dialog>;
});

