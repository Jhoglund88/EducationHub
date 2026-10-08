export type IconName = 'today' | 'notes' | 'tasks' | 'studies' | 'plus' | 'close' | 'arrow';
const paths: Record<IconName, string> = {
  today: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z M7 14h3m-3 4h6',
  notes: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5M7 12h8m-8 4h6',
  tasks: 'm3 6 2 2 4-4m3 2h9M3 13l2 2 4-4m3 2h9M3 20l2 2 4-4m3 2h9',
  studies: 'm2 8 10-5 10 5-10 5L2 8Zm4 3v6c4 3 8 3 12 0v-6m4-3v8',
  plus: 'M12 5v14M5 12h14', close: 'm6 6 12 12M6 18 18 6', arrow: 'M5 12h14m-6-6 6 6-6 6',
};
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
