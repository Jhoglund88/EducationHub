export type EntityId = string;
export type TaskStatus = 'today' | 'later' | 'done';
export interface StudyLink { courseId?: EntityId; projectId?: EntityId }
export interface Note extends StudyLink { id: EntityId; title: string; text: string; createdAt: string; updatedAt: string }
export interface Task extends StudyLink { id: EntityId; title: string; status: TaskStatus; createdAt: string; updatedAt: string }
export interface Course { id: EntityId; name: string; description: string; startDate?: string; endDate?: string; isCurrent: boolean }
export interface Project { id: EntityId; name: string; description: string; courseId?: EntityId }
