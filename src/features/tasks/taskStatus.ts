import type { Task, TaskStatus } from '../../models/entities';
export const taskStatuses: { value: TaskStatus; label: string; empty: string }[] = [
  { value: 'today', label: 'Idag', empty: 'Inga uppgifter för idag. Ett litet steg räcker.' },
  { value: 'later', label: 'Senare', empty: 'Här finns plats för det som kan vänta.' },
  { value: 'done', label: 'Klart', empty: 'Dina färdiga uppgifter samlas här.' },
];
export function withStatus(task: Task, status: TaskStatus): Task {
  return { ...task, status, updatedAt: new Date().toISOString() };
}
