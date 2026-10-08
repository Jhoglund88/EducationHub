import { useRef, useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import type { ViewId } from './navigation';
import { QuickAdd } from '../components/QuickAdd';
import { Icon } from '../components/Icon';
import { TodayView } from '../features/today/TodayView';
import { NotesView } from '../features/notes/NotesView';
import { TasksView } from '../features/tasks/TasksView';
import { StudiesView } from '../features/studies/StudiesView';
export function App() {
  const [view, setView] = useState<ViewId>('today');
  const main = useRef<HTMLElement>(null);
  function navigate(next: ViewId) {
    setView(next);
    window.scrollTo({ top: 0 });
    main.current?.focus();
  }
  return <div className="app-shell">
    <a className="skip-link" href="#main">Hoppa till innehåll</a>
    <header className="brand-bar"><span className="brand-mark"><Icon name="studies" size={20}/></span><span>Education Hub</span><span className="brand-caption">Din studieplats</span></header>
    <main id="main" ref={main} tabIndex={-1}>
      {view === 'today' && <TodayView onNavigate={navigate}/>}
      {view === 'notes' && <NotesView/>}
      {view === 'tasks' && <TasksView/>}
      {view === 'studies' && <StudiesView/>}
    </main>
    <QuickAdd/><BottomNavigation active={view} onChange={navigate}/>
  </div>;
}
