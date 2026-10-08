import type { Note } from '../../models/entities';
import { EmptyState } from '../../components/EmptyState';
const dateFormatter = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export function NotesView({ notes, loading, error, onRetry, onCreate, onOpen, getLinkLabel }: { getLinkLabel: (note: Note) => string | undefined; notes: Note[]; loading: boolean; error: string; onRetry: () => void; onCreate: () => void; onOpen: (note: Note) => void }) {
  return <><header className="page-heading"><p className="eyebrow">TANKAR & LÄRDOMAR</p><h1>Anteckningar</h1><p>Det du vill komma ihåg, samlat på ett ställe.</p></header>
    {error ? <div className="surface feedback"><p role="alert" className="error-message">{error}</p><button className="text-button" onClick={onRetry}>Försök igen</button></div> : loading ? <p role="status">Läser anteckningar…</p> : <>
      <div className="section-heading"><p className="muted">{notes.length} {notes.length === 1 ? 'anteckning' : 'anteckningar'}</p><button className="text-button" onClick={onCreate}>+ Ny anteckning</button></div>
      {notes.length === 0 ? <section className="surface"><EmptyState icon="notes" title="Ge dina tankar en plats">Samla tankar, idéer och det du lär dig. Skapa din första anteckning när du vill.</EmptyState></section> : <ul className="notes-list">{notes.map(note => <li key={note.id}><button className="note-card" onClick={() => onOpen(note)}><h2>{note.title}</h2>{getLinkLabel(note) && <span className="link-label">{getLinkLabel(note)}</span>}<p>{note.text || 'Ingen text ännu'}</p><time dateTime={note.updatedAt}>{note.createdAt === note.updatedAt ? 'Skapad' : 'Ändrad'} {dateFormatter.format(new Date(note.updatedAt))}</time></button></li>)}</ul>}
    </>}
  </>;
}
