import type { Course, Project, StudyLink } from '../../models/entities';
export function linkValue(link: StudyLink): string { return link.projectId ? `project:${link.projectId}` : link.courseId ? `course:${link.courseId}` : ''; }
export function selectedLink(value: string): StudyLink {
  return { courseId: value.startsWith('course:') ? value.slice(7) : undefined, projectId: value.startsWith('project:') ? value.slice(8) : undefined };
}
export function validLink(link: StudyLink, courses: Course[], projects: Project[]): StudyLink {
  if (link.projectId && projects.some(p=>p.id===link.projectId)) return { courseId: undefined, projectId: link.projectId };
  if (link.courseId && courses.some(c=>c.id===link.courseId)) return { courseId: link.courseId, projectId: undefined };
  return { courseId: undefined, projectId: undefined };
}
export function linkLabel(link: StudyLink, courses: Course[], projects: Project[]): string | undefined {
  const clean = validLink(link,courses,projects);
  return clean.projectId ? projects.find(p=>p.id===clean.projectId)?.name : courses.find(c=>c.id===clean.courseId)?.name;
}
