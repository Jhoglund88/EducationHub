import type { StudyLink } from '../models/entities';
import { linkLabel, validLink } from '../features/studies/studyLinks';
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
  const linksReady = !studies.loading && !studies.error;
  const visibleNotes = notes.notes.map(note=>({...note,...(linksReady ? validLink(note,studies.courses,studies.projects) : {})}));
  const visibleTasks = tasks.tasks.map(task=>({...task,...(linksReady ? validLink(task,studies.courses,studies.projects) : {})}));
  const getLinkLabel = (link: StudyLink) => linkLabel(link, studies.courses, studies.projects);
  async function removeCourse(id: string) { await studies.removeCourse(id); await Promise.all([notes.reload(), tasks.reload()]); }
  async function removeProject(id: string) { await studies.removeProject(id); await Promise.all([notes.reload(), tasks.reload()]); }
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
      {view === 'notes' && <NotesView getLinkLabel={getLinkLabel} {...notes} notes={visibleNotes} onRetry={() => void notes.reload()} onCreate={() => editor.current?.open()} onOpen={note => editor.current?.open(note)}/>}
      {view === 'tasks' && <TasksView getLinkLabel={getLinkLabel} {...tasks} tasks={visibleTasks} onRetry={() => void tasks.reload()} onCreate={() => taskEditor.current?.open()} onOpen={task => taskEditor.current?.open(task)} onStatus={(task, status) => void tasks.changeStatus(task, status)}/>}
      {view === 'studies' && <StudiesView {...studies} onRetry={() => void studies.reload()} onOpen={(kind, item) => studyEditor.current?.open(kind, item)}/>}
    </main>
    <StudyEditor ref={studyEditor} {...studies} notes={visibleNotes} tasks={visibleTasks} contentError={notes.error || tasks.error} contentLoading={notes.loading || tasks.loading} onNote={note=>editor.current?.open(note)} onTask={task=>taskEditor.current?.open(task)} removeCourse={removeCourse} removeProject={removeProject}/><NoteEditor linksReady={Boolean(linksReady)} courses={studies.courses} projects={studies.projects} ref={editor} onSave={notes.save} onRemove={notes.remove}/><TaskEditor linksReady={Boolean(linksReady)} courses={studies.courses} projects={studies.projects} ref={taskEditor} onSave={tasks.save} onRemove={tasks.remove}/><QuickAdd onNewNote={() => editor.current?.open()} onNewTask={() => taskEditor.current?.open()}/><BottomNavigation active={view} onChange={navigate}/>
  </div>;
}
