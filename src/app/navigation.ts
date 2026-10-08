import type { IconName } from '../components/Icon';
export type ViewId = 'today' | 'notes' | 'tasks' | 'studies';
export const navigation: { id: ViewId; label: string; icon: IconName }[] = [
  { id: 'today', label: 'Idag', icon: 'today' },
  { id: 'notes', label: 'Anteckningar', icon: 'notes' },
  { id: 'tasks', label: 'Uppgifter', icon: 'tasks' },
  { id: 'studies', label: 'Studier', icon: 'studies' },
];
