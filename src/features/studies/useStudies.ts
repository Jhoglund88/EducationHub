import { useCallback, useEffect, useState } from 'react';
import type { Course, Project } from '../../models/entities';
import { studiesRepository } from '../../storage/LocalStudiesRepository';
export function useStudies() {
  const [data, setData] = useState<{ courses: Course[]; projects: Project[] }>({ courses: [], projects: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setData(await studiesRepository.load()); setError(''); }
    catch (error) { setError(error instanceof Error ? error.message : 'Studierna kunde inte läsas.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  async function refresh() { setData(await studiesRepository.load()); setError(''); }
  async function saveCourse(course: Course) { await studiesRepository.courses.save(course); await refresh(); }
  async function saveProject(project: Project) { await studiesRepository.projects.save(project); await refresh(); }
  async function removeCourse(id: string) { await studiesRepository.courses.remove(id); await refresh(); }
  async function removeProject(id: string) { await studiesRepository.projects.remove(id); await refresh(); }
  return { ...data, error, loading, reload, saveCourse, saveProject, removeCourse, removeProject };
}
