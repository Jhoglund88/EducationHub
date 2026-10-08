import type { Task, TaskStatus } from '../../models/entities';
const formatter = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' });
export function TaskRow({ task, disabled, onOpen, onStatus }: { task: Task; disabled: boolean; onOpen: (task: Task) => void; onStatus: (task: Task, status: TaskStatus) => void }) {
  return <li className="task-row"><label className="task-check"><input type="checkbox" checked={task.status === 'done'} disabled={disabled} aria-label={task.status === 'done' ? `Flytta ${task.title} till Idag` : `Markera ${task.title} som klar`} onChange={event => onStatus(task, event.target.checked ? 'done' : 'today')}/></label><button className="task-open" disabled={disabled} onClick={() => onOpen(task)}><span className={task.status === 'done' ? 'task-completed' : undefined}>{task.title}</span><time dateTime={task.createdAt}>Skapad {formatter.format(new Date(task.createdAt))}</time></button></li>;
}
