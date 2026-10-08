import { useRef, useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import type { ViewId } from './navigation';
import { QuickAdd } from '../components/QuickAdd';
import { Icon } from '../components/Icon';
import { TodayView } from '../features/today/TodayView';
import { NotesView } from '../features/notes/NotesView';
import { TasksView } from '../features/tasks/TasksView';
import { StudiesView } from '../features/studies/StudiesView';
import { useNotes } from '../features/notes/useNotes';
import { NoteEditor, type NoteEditorHandle } from '../features/notes/NoteEditor';
import { useTasks } from '../features/tasks/useTasks';
import { TaskEditor, type TaskEditorHandle } from '../features/tasks/TaskEditor';
import { useStudies } from '../features/studies/useStudies';
import { StudyEditor, type StudyEditorHandle } from '../features/studies/StudyEditor';
export function App() {
  const studies = useStudies();
  const studyEditor = useRef<StudyEditorHandle>(null);
  const tasks = useTasks();
  const taskEditor = useRef<TaskEditorHandle>(null);
  const notes = useNotes();
  const editor = useRef<NoteEditorHandle>(null);
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
      {view === 'today' && <TodayView onNavigate={navigate} currentCourse={studies.courses.find(course => course.isCurrent)} studiesError={studies.error} studiesLoading={studies.loading}/>}
      {view === 'notes' && <NotesView {...notes} onRetry={() => void notes.reload()} onCreate={() => editor.current?.open()} onOpen={note => editor.current?.open(note)}/>}
      {view === 'tasks' && <TasksView {...tasks} onRetry={() => void tasks.reload()} onCreate={() => taskEditor.current?.open()} onOpen={task => taskEditor.current?.open(task)} onStatus={(task, status) => void tasks.changeStatus(task, status)}/>}
      {view === 'studies' && <StudiesView {...studies} onRetry={() => void studies.reload()} onOpen={(kind, item) => studyEditor.current?.open(kind, item)}/>}
    </main>
    <StudyEditor ref={studyEditor} {...studies}/><NoteEditor ref={editor} onSave={notes.save} onRemove={notes.remove}/><TaskEditor ref={taskEditor} onSave={tasks.save} onRemove={tasks.remove}/><QuickAdd onNewNote={() => editor.current?.open()} onNewTask={() => taskEditor.current?.open()}/><BottomNavigation active={view} onChange={navigate}/>
  </div>;
}
