import type { Task, TaskStatus } from '../../models/entities';
import { taskStatuses } from './taskStatus';
import { TaskRow } from './TaskRow';
export function TasksView({ tasks, loading, error, actionError, pendingId, onRetry, onCreate, onOpen, onStatus }: { tasks: Task[]; loading: boolean; error: string; actionError: string; pendingId: string | null; onRetry: () => void; onCreate: () => void; onOpen: (task: Task) => void; onStatus: (task: Task, status: TaskStatus) => void }) {
  return <><header className="page-heading"><p className="eyebrow">FOKUS & PLANERING</p><h1>Uppgifter</h1><p>Små steg framåt. I din egen takt.</p></header>
    {error ? <div className="surface feedback"><p className="error-message" role="alert">{error}</p><button className="text-button" onClick={onRetry}>Försök igen</button></div> : loading ? <p role="status">Läser uppgifter…</p> : <>
      <div className="section-heading"><p className="muted">{tasks.length} {tasks.length === 1 ? 'uppgift' : 'uppgifter'}</p><button className="text-button" onClick={onCreate}>+ Ny uppgift</button></div>
      {actionError && <p className="error-message" role="alert">{actionError}</p>}
      {taskStatuses.map(group => { const items = tasks.filter(task => task.status === group.value); return <section className="section-block" key={group.value} aria-labelledby={`group-${group.value}`}><div className="section-heading"><h2 id={`group-${group.value}`}>{group.label}</h2><span className="task-count">{items.length}</span></div>{items.length ? <ul className="task-list">{items.map(task => <TaskRow key={task.id} task={task} disabled={pendingId !== null} onOpen={onOpen} onStatus={onStatus}/>)}</ul> : <p className="surface task-empty">{group.empty}</p>}</section>; })}
    </>}
  </>;
}
