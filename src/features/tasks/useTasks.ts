import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task, TaskStatus } from '../../models/entities';
import { tasksRepository } from '../../storage/LocalTasksRepository';
import { withStatus } from './taskStatus';
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const updating = useRef(false);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setTasks(await tasksRepository.list()); setError(''); }
    catch (error) { setError(error instanceof Error ? error.message : 'Uppgifterna kunde inte läsas.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  async function save(task: Task) {
    await tasksRepository.save(task);
    setTasks(current => [task, ...current.filter(item => item.id !== task.id)].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)));
    setActionError('');
  }
  async function remove(id: string) {
    await tasksRepository.remove(id);
    setTasks(current => current.filter(task => task.id !== id));
    setActionError('');
  }
  async function changeStatus(task: Task, status: TaskStatus) {
    if (updating.current) return;
    updating.current = true; setPendingId(task.id);
    try { await save(withStatus(task, status)); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Statusen kunde inte sparas. Försök igen.'); }
    finally { updating.current = false; setPendingId(null); }
  }
  return { tasks, error, actionError, loading, pendingId, reload, save, remove, changeStatus };
}
