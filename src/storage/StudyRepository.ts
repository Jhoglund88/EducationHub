import type { Course, EntityId, Note, Project, Task } from '../models/entities';
// Async operations allow a future local or remote implementation without changing views.
export interface EntityRepository<T extends { id: EntityId }> {
  list(): Promise<T[]>;
  save(entity: T): Promise<void>;
  remove(id: EntityId): Promise<void>;
}
export interface StudyRepository {
  notes: EntityRepository<Note>;
  tasks: EntityRepository<Task>;
  courses: EntityRepository<Course>;
  projects: EntityRepository<Project>;
}
